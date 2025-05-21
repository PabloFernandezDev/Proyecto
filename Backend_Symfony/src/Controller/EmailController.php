<?php

namespace App\Controller;

use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
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

        $email = (new Email())
            ->from('carecarenow@gmail.com')
            ->to($emailUsuario)
            ->subject('¡Gracias por suscribirte!')
            ->text('Gracias por unirte a nuestro boletín. Pronto recibirás nuestras novedades y ofertas.');

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
        $usuario->setTokenConfirmacion(null);
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
        <h2>Hola $nombre,</h2>
        <p>Tu cita ha sido registrada correctamente.</p>
        <p><strong>Fecha:</strong> $fecha<br/>
        <strong>Hora:</strong> $hora<br/>
        <strong>Provincia:</strong> $provincia<br/>
        <strong>Dirección del taller:</strong> $direccion</p>
        <p>Gracias por confiar en CareCare Now.</p>
    ";

        $correo = (new Email())
            ->from('carecarenow@gmail.com')
            ->to($email)
            ->subject("Confirmación de tu cita")
            ->html($contenido);

        $mailer->send($correo);

        return new JsonResponse(['message' => 'Correo de cita enviado correctamente']);
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
            ->subject("Tu coche está listo para recoger")
            ->html($contenido);

        $mailer->send($correo);

        return new JsonResponse(['message' => 'Correo enviado correctamente']);
    }



    #[Route('/notificar/recogida', name: 'notificar_recogida', methods: ['POST'])]
    public function notificarRecogida(Request $request, MailerInterface $mailer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $nombre = $data['nombre'] ?? 'cliente';

        if (!$email) {
            return new JsonResponse(['error' => 'Falta el email'], 400);
        }

        $correo = (new Email())
            ->from('carecarenow@gmail.com')
            ->to($email)
            ->subject('Tu coche está listo para recoger\n')
            ->text("Hola $nombre, tu coche ya está reparado y listo para ser recogido. Puedes venir cuando desees.");

        $mailer->send($correo);

        return new JsonResponse(['message' => 'Correo enviado correctamente']);
    }




}
