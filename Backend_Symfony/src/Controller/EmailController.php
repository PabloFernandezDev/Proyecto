<?php

namespace App\Controller;

use App\Entity\Factura;
use App\Entity\LineaFactura;
use App\Repository\FacturaRepository;
use App\Repository\UsuarioRepository;
use Doctrine\DBAL\Driver\Mysqli\Initializer\Options;
use Doctrine\ORM\EntityManagerInterface;
use Dompdf\Dompdf;
use Dompdf\Options as DompdfOptions;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Attribute\Route;
#[Route('/')]
final class EmailController extends AbstractController
{
    #[Route('/enviar/gmail/newsletter', name: 'api_enviar_email_newsletter', methods: ['POST'])]
    public function enviar(Request $request, MailerInterface $mailer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $emailUsuario = $data['email'] ?? null;

        if (!$emailUsuario) {
            return new JsonResponse(['error' => 'Email no proporcionado'], 400);
        }

        $htmlContent = "
    <div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
        <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>
            <div style='background-color: #d60000; color: white; padding: 20px; text-align: center;'>
                <h2>¡Gracias por suscribirte!</h2>
            </div>
            <div style='padding: 30px;'>
                <p style='font-size: 16px;'>Hola,</p>
                <p style='font-size: 16px;'>Te damos la bienvenida a <strong>CareCareNow</strong>.</p>
                <p style='font-size: 16px;'>Pronto recibirás en tu bandeja de entrada las últimas novedades, consejos de mantenimiento y ofertas exclusivas para tu vehículo.</p>
                <p style='font-size: 14px; color: #555;'>Si no te suscribiste, puedes ignorar este mensaje.</p>
            </div>
            <div style='background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 12px; color: #888;'>
                © " . date('Y') . " CareCareNow. Todos los derechos reservados.
            </div>
        </div>
    </div>
    ";

        $email = (new Email())
            ->from('carecarenow@gmail.com')
            ->to($emailUsuario)
            ->subject('¡Gracias por suscribirte!')
            ->html($htmlContent);

        $mailer->send($email);

        return new JsonResponse(['message' => 'Correo enviado con éxito']);
    }



    #[Route('/confirmar/{token}', name: 'confirmar_usuario', methods: ['GET'])]
    public function confirmarCuenta(string $token, UsuarioRepository $repo, EntityManagerInterface $em): RedirectResponse
    {
        $usuario = $repo->findOneBy(['tokenConfirmacion' => $token]);

        if (!$usuario) {
            return new RedirectResponse('http://localhost:5173/error-token');
        }

        $usuario->setConfirmado(true);
        $em->flush();

        return new RedirectResponse('http://localhost:5173/confirmado');
    }


    #[Route('/mail/cita', name: 'enviar_cita_mail', methods: ['POST'])]
    public function enviarCitaMail(
        Request $request,
        MailerInterface $mailer,
        UsuarioRepository $usuarioRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $userId = $data['userId'] ?? null;
        $fecha = $data['fecha'] ?? null;
        $hora = $data['hora'] ?? null;
        $provincia = $data['provincia'] ?? null;
        $direccion = $data['direccion'] ?? null;

        if (!$userId || !$fecha || !$hora || !$provincia || !$direccion) {
            return new JsonResponse(['error' => 'Faltan datos obligatorios'], 400);
        }

        $usuario = $usuarioRepository->find($userId);

        if (!$usuario) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        $email = $usuario->getEmail();
        $nombre = $usuario->getNombre();

        $contenido = "
<div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
    <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>
        <div style='background-color: #d60000; color: white; padding: 20px; text-align: center;'>
            <h2>Cita confirmada - CareCareNow</h2>
        </div>
        <div style='padding: 30px;'>
            <p style='font-size: 16px;'>Hola <strong>$nombre</strong>,</p>
            <p style='font-size: 16px;'>Tu cita ha sido registrada correctamente. A continuación te dejamos los detalles:</p>
            <ul style='font-size: 16px; color: #333; line-height: 1.6;'>
                <li><strong>Fecha:</strong> $fecha</li>
                <li><strong>Hora:</strong> $hora</li>
                <li><strong>Provincia:</strong> $provincia</li>
                <li><strong>Dirección del taller:</strong> $direccion</li>
            </ul>
            <p style='font-size: 16px;'>Te esperamos puntual. Si tienes alguna duda o necesitas cambiar la cita, puedes hacerlo desde tu panel.</p>
        </div>
        <div style='background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 12px; color: #888;'>
            © " . date('Y') . " CareCareNow. Todos los derechos reservados.
        </div>
    </div>
</div>
";


        $correo = (new Email())
            ->from('carecarenow@gmail.com')
            ->to($email)
            ->subject("Confirmación de tu cita")
            ->html($contenido);

        $mailer->send($correo);

        return new JsonResponse(['message' => 'Correo de cita enviado correctamente']);
    }

    #[Route('/enviar-confirmacion/{id}', name: 'api_enviar_confirmacion', methods: ['GET'])]
    public function enviarConfirmacion(
        int $id,
        UsuarioRepository $usuarioRepository,
        MailerInterface $mailer
    ): JsonResponse {
        $usuario = $usuarioRepository->find($id);

        if (!$usuario) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        if ($usuario->isConfirmado()) {
            return new JsonResponse(['message' => 'El usuario ya ha confirmado su cuenta.'], 200);
        }

        $token = $usuario->getTokenConfirmacion();
        if (!$token) {
            return new JsonResponse(['error' => 'Token de confirmación no disponible.'], 400);
        }

        $enlaceConfirmacion = 'http://localhost:8000/confirmar/' . $token;

        $emailMensaje = (new Email())
            ->from('carecarenow360@gmail.com')
            ->to($usuario->getEmail())
            ->subject('Confirma tu cuenta en CareCareNow')
            ->html("
    <div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
        <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>
            <div style='background-color: #d60000; color: white; padding: 20px; text-align: center;'>
                <h2>Bienvenido a CareCareNow</h2>
            </div>
            <div style='padding: 30px;'>
                <p style='font-size: 16px;'>Hola <strong>{$usuario->getNombre()} {$usuario->getApellidos()}</strong>,</p>
                <p style='font-size: 16px;'>Gracias por registrarte. Para activar tu cuenta, por favor haz clic en el botón a continuación:</p>
                <p style='text-align: center; margin: 30px 0;'>
                    <a href='$enlaceConfirmacion' style='background-color: #d60000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Confirmar cuenta</a>
                </p>
                <p style='font-size: 14px; color: #555;'>Si no te registraste, puedes ignorar este mensaje.</p>
            </div>
            <div style='background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 12px; color: #888;'>
                © " . date('Y') . " CareCareNow. Todos los derechos reservados.
            </div>
        </div>
    </div>
    ");


        $mailer->send($emailMensaje);

        return new JsonResponse(['message' => 'Correo de confirmación enviado con éxito.']);
    }

    #[Route('/mail/cita/recoger', name: 'enviar_correo_recogida', methods: ['POST'])]
    public function enviarCorreoRecogida(Request $request, UsuarioRepository $usuarioRepository, MailerInterface $mailer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $userId = $data['userId'] ?? null;
        $fecha = $data['fecha'] ?? null;
        $direccion = $data['direccion'] ?? null;

        if (!$userId || !$fecha || !$direccion) {
            return new JsonResponse(['error' => 'Faltan datos'], 400);
        }

        $usuario = $usuarioRepository->find($userId);

        if (!$usuario) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        $email = $usuario->getEmail();
        $nombre = $usuario->getNombre();

        $contenido = "
        <h2>Hola $nombre,</h2>
        <p>Podrá su coche recoger</p>
        <p><strong>Fecha de recogida:</strong> $fecha</p>
        <p><strong>Dirección del taller:</strong> $direccion</p>
        <p>Gracias por confiar en CareCareNow.</p>
    ";

        $correo = (new Email())
            ->from('carecarenow@gmail.com')
            ->to($email)
            ->subject("Cita para recoger coche")
            ->html($contenido);

        $mailer->send($correo);

        return new JsonResponse(['message' => 'Correo enviado correctamente']);
    }


    #[Route('/notificar/recogida', name: 'notificar_recogida_coche', methods: ['POST'])]
    public function notificarRecogida(Request $request, MailerInterface $mailer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $nombre = $data['nombre'] ?? 'cliente';

        if (!$email) {
            return new JsonResponse(['error' => 'Falta el email'], 400);
        }

        $htmlContent = "
    <div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
        <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>
            <div style='background-color: #d60000; color: white; padding: 20px; text-align: center;'>
                <h2>Tu coche está listo para recoger</h2>
            </div>
            <div style='padding: 30px;'>
                <p style='font-size: 16px;'>Hola <strong>$nombre</strong>,</p>
                <p style='font-size: 16px;'>Nos complace informarte de que tu vehículo ha sido reparado correctamente y ya puedes venir a recogerlo.</p>
                <p style='font-size: 14px;'>Gracias por confiar en nosotros.</p>
            </div>
            <div style='background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 12px; color: #888;'>
                © " . date('Y') . " CareCareNow. Todos los derechos reservados.
            </div>
        </div>
    </div>
    ";

        $correo = (new Email())
            ->from('carecarenow@gmail.com')
            ->to($email)
            ->subject('Tu coche está listo para recoger')
            ->html($htmlContent);

        $mailer->send($correo);

        return new JsonResponse(['message' => 'Correo enviado correctamente']);
    }



    #[Route('/mail/cita/actualizada', name: 'notificar_actualizacion_cita', methods: ['POST'])]
    public function actualizarCita(Request $request, MailerInterface $mailer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $nombre = $data['nombre'] ?? 'cliente';
        $fecha = $data['fecha'] ?? null;
        $hora = $data['hora'] ?? null;
        $provincia = $data['provincia'] ?? null;
        $direccion = $data['direccion'] ?? null;

        if (!$email || !$fecha || !$hora || !$provincia || !$direccion) {
            return new JsonResponse(['error' => 'Faltan datos obligatorios'], 400);
        }

        $htmlContent = "
    <div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
        <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>
            <div style='background-color: #d60000; color: white; padding: 20px; text-align: center;'>
                <h2>Cita confirmada - CareCareNow</h2>
            </div>
            <div style='padding: 30px;'>
                <p style='font-size: 16px;'>Hola <strong>$nombre</strong>,</p>
                <p style='font-size: 16px;'>Tu cita ha sido actualizada. A continuación te dejamos los nuevos detalles:</p>
                <ul style='font-size: 16px; color: #333; line-height: 1.6;'>
                    <li><strong>Fecha:</strong> $fecha</li>
                    <li><strong>Hora:</strong> $hora</li>
                    <li><strong>Provincia:</strong> $provincia</li>
                    <li><strong>Dirección del taller:</strong> $direccion</li>
                </ul>
                <p style='font-size: 16px;'>Te esperamos puntual. Si necesitas cambiar la cita, puedes hacerlo desde tu panel.</p>
            </div>
            <div style='background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 12px; color: #888;'>
                © " . date('Y') . " CareCareNow. Todos los derechos reservados.
            </div>
        </div>
    </div>
    ";

        $correo = (new Email())
            ->from('carecarenow@gmail.com')
            ->to($email)
            ->subject('Cita actualizada - CareCareNow')
            ->html($htmlContent);

        $mailer->send($correo);

        return new JsonResponse(['message' => 'Correo enviado correctamente']);
    }



    #[Route('/presupuesto/{id}/enviar', name: 'enviar_presupuesto', methods: ['POST'])]
    public function enviarPresupuestoEmail(
        int $id,
        UsuarioRepository $usuarioRepository,
        MailerInterface $mailer
    ): JsonResponse {
        $usuario = $usuarioRepository->find($id);

        if (!$usuario) {
            return new JsonResponse(['error' => 'Usuario no encontrada'], 404);
        }

        $nombre = $usuario->getNombre();
        $emailDestino = $usuario->getEmail();

        $htmlEmail = "
    <div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
        <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>
            <div style='background-color: #d60000; color: white; padding: 20px; text-align: center;'>
                <h2>Nuevo presupuesto disponible - CareCareNow</h2>
            </div>
            <div style='padding: 30px;'>
                <p style='font-size: 16px;'>Hola <strong>$nombre</strong>,</p>
                <p style='font-size: 16px;'>Hemos generado un presupuesto para la reparación de tu coche.</p>
                <p style='font-size: 16px;'>Puedes consultarlo y confirmar tu consentimiento desde tu panel de usuario, en el apartado de <strong>Facturas</strong>.</p>
                <p style='font-size: 16px;'>Gracias por confiar en nosotros.</p>
            </div>
            <div style='background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 12px; color: #888;'>
                © " . date('Y') . " CareCareNow. Todos los derechos reservados.
            </div>
        </div>
    </div>
    ";

        $email = (new Email())
            ->from('carecarenow@gmail.com')
            ->to($emailDestino)
            ->subject('Presupuesto disponible - CareCareNow')
            ->html($htmlEmail);

        $mailer->send($email);

        return new JsonResponse(['mensaje' => 'Correo enviado con éxito']);
    }



}
