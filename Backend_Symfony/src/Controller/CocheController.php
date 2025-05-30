<?php

namespace App\Controller;

use App\Entity\Coche;
use App\Entity\Notificacion;
use App\Entity\Usuario;
use App\Repository\AdministradorRepository;
use App\Repository\CocheRepository;
use App\Repository\MarcaRepository;
use App\Repository\ModeloRepository;
use App\Repository\NotificacionRepository;
use App\Repository\TallerRepository;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/')]
final class CocheController extends AbstractController
{
    #[Route('/coche', name: 'coche_add', methods: ['POST'])]
    public function addCoche(
        Request $request,
        EntityManagerInterface $em,
        MarcaRepository $marcaRepository,
        ModeloRepository $modeloRepository,
        UsuarioRepository $usuarioRepository,
        SluggerInterface $slugger
    ): JsonResponse {
        $marcaNombre = $request->get('marca');
        $modeloNombre = $request->get('modelo');
        $año = $request->get('año');
        $usuarioId = $request->get('usuario');
        $matricula = $request->get('matricula');

        $imagenFile = $request->files->get('imagen');

        $marca = $marcaRepository->findOneBy(['nombre' => $marcaNombre]);
        $modelo = $modeloRepository->findOneBy(['nombre' => $modeloNombre]);
        $usuario = $usuarioRepository->find($usuarioId);

        if (!$marca || !$modelo || !$usuario) {
            return new JsonResponse(['detail' => 'Marca, modelo o usuario no encontrado'], 400);
        }

        if (!$imagenFile) {
            return new JsonResponse(['detail' => 'No se recibió ninguna imagen'], 400);
        }

        $coche = new Coche();
        $coche->setMarca($marca);
        $coche->setModelo($modelo);
        $coche->setUsuario($usuario);
        $coche->setMatricula($matricula);
        $coche->setAño((int) $año);

        $safeName = $slugger->slug(pathinfo($imagenFile->getClientOriginalName(), PATHINFO_FILENAME));
        $newFilename = $safeName . '-' . uniqid() . '.' . $imagenFile->guessExtension();

        try {
            $imagenFile->move(
                $this->getParameter('upload_directory_images'),
                $newFilename
            );
            $coche->setImagen($newFilename);
        } catch (FileException $e) {
            return new JsonResponse(['detail' => 'Error al subir imagen'], 500);
        }

        $em->persist($coche);
        $em->flush();

        return new JsonResponse(['detail' => 'Coche añadido correctamente'], 201);
    }


    #[Route('/user/{id}/coche', name: 'user_car', methods: ['GET'])]
    public function getUserCar(Usuario $usuario, SerializerInterface $serializer): JsonResponse
    {
        $coche = $usuario->getCoches()->first();
        if (!$coche) {
            return new JsonResponse(['detail' => 'Sin coche'], 404);
        }

        $json = $serializer->serialize($coche, 'json', ['groups' => ['coche:read']]);
        return new JsonResponse($json, 200, [], true);
    }

    #[Route('/coches', name: 'coches', methods: ['GET'])]
    public function getCars(CocheRepository $cocheRepository, SerializerInterface $serializer): JsonResponse
    {
        $coche = $cocheRepository->findAll();

        $json = $serializer->serialize($coche, 'json', ['groups' => ['coche:read']]);
        return new JsonResponse($json, 200, [], true);
    }

    #[Route('/coche/{id}/delete', name: 'coche_delete', methods: ['DELETE'])]
    public function deleteCoche(int $id, CocheRepository $cocheRepository, EntityManagerInterface $em): JsonResponse
    {
        $coche = $cocheRepository->find($id);

        if (!$coche) {
            return new JsonResponse(['detail' => 'Coche no encontrado'], 404);
        }

        if (!$coche->getReparaciones()->isEmpty()) {
            return new JsonResponse(['detail' => 'No se puede eliminar el coche porque tiene reparaciones asociadas'], 400);
        }

        $em->remove($coche);
        $em->flush();

        return new JsonResponse(['detail' => 'Coche eliminado correctamente'], 200);
    }

    #[Route('/admin/{id}/coches', name: 'admin_coches_y_reparaciones', methods: ['GET'])]
    public function cochesYTareasPorAdmin(
        int $id,
        AdministradorRepository $adminRepo,
        CocheRepository $cocheRepo,
        SerializerInterface $serializer
    ): JsonResponse {
        $admin = $adminRepo->find($id);

        if (!$admin) {
            return $this->json(['detail' => 'Administrador no encontrado'], 404);
        }

        $taller = $admin->getTaller();
        if (!$taller) {
            return $this->json(['detail' => 'Este administrador no tiene taller asignado'], 400);
        }

        $coches = $cocheRepo->findBy(['taller' => $taller]);

        $context = [
            'circular_reference_handler' => fn($object, string $format, array $context) => $object->getId(),
            'groups' => ['leerCoches:read'],
            'enable_max_depth' => true,
        ];

        $json = $serializer->serialize($coches, 'json', $context);
        return new JsonResponse($json, 200, [], true);
    }






    #[Route('/user/coche/{id}/reparaciones', name: 'userCocheReparaciones', methods: ['GET'])]
    public function userCocheReparaciones(int $id, CocheRepository $cocheRepository, SerializerInterface $serializer): JsonResponse
    {
        $coches = $cocheRepository->find($id);

        $context = [
            'circular_reference_handler' => function ($object, string $format, array $context) {
                return $object->getId();
            },
            'groups' => ['coches:read']

        ];

        $jsonCoches = $serializer->serialize($coches, 'json', $context);

        return new JsonResponse($jsonCoches, 200, [], true);
    }

    #[Route('/coche/{id}/devolver', name: 'user_coche_devolver', methods: ['PATCH'])]
    public function devolverCoche(
        int $id,
        EntityManagerInterface $em,
        CocheRepository $cocheRepository,
        NotificacionRepository $notificacionRepository,
        MailerInterface $mailer
    ): JsonResponse {
        $coche = $cocheRepository->find($id);

        if (!$coche) {
            return new JsonResponse(['error' => 'Coche no encontrado'], 404);
        }

        $usuario = $coche->getUsuario();

        foreach ($coche->getReparaciones() as $reparacion) {
            $em->remove($reparacion);
        }

        $coche->setTaller(null);
        $coche->setEstado(null);

        $notificacion = new Notificacion();
        $notificacion->setUsuario($usuario);
        $notificacion->setLeido(false);
        $notificacion->setMensaje('Su coche ha sido devuelto. Gracias por confiar en nosotros.');
        $notificacion->setFecha(new \DateTime());
        $em->persist($notificacion);

        if ($usuario && $usuario->getEmail()) {
            $correo = (new Email())
                ->from('carecarenow@gmail.com')
                ->to($usuario->getEmail())
                ->subject('Tu coche ha sido devuelto')
                ->html("
                <div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                    <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>
                        <div style='background-color: #d60000; color: white; padding: 20px; text-align: center;'>
                            <h2>CareCareNow</h2>
                        </div>
                        <div style='padding: 30px;'>
                            <p style='font-size: 16px;'>Hola <strong>{$usuario->getNombre()} {$usuario->getApellidos()}</strong>,</p>
                            <p style='font-size: 16px;'>Tu coche ha sido devuelto. Gracias por confiar en nosotros.</p>
                            <p style='font-size: 16px;'>Puedes volver cuando lo necesites.</p>
                        </div>
                        <div style='background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 12px; color: #888;'>
                            © " . date('Y') . " CareCareNow. Todos los derechos reservados.
                        </div>
                    </div>
                </div>
            ");

            $mailer->send($correo);
        }

        $em->flush();

        return new JsonResponse(['success' => true, 'mensaje' => 'Coche devuelto correctamente']);
    }


    #[Route('/coche/{id}/recibir', name: 'actualizar_coche_estado_taller', methods: ['PATCH'])]
    public function actualizarEstadoYCoche(
        int $id,
        Request $request,
        EntityManagerInterface $em,
        CocheRepository $cocheRepo,
        TallerRepository $tallerRepo
    ): JsonResponse {
        $coche = $cocheRepo->find($id);

        if (!$coche) {
            return new JsonResponse(['error' => 'Coche no encontrado'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $nuevoEstado = $data['estado'] ?? null;
        $idTaller = $data['taller'] ?? null;

        if ($nuevoEstado) {
            $coche->setEstado($nuevoEstado);
        }

        if ($idTaller) {
            $taller = $tallerRepo->find($idTaller);
            if (!$taller) {
                return new JsonResponse(['error' => 'Taller no encontrado'], 404);
            }
            $coche->setTaller($taller);
        }

        $em->flush();

        return new JsonResponse(['mensaje' => 'Coche actualizado correctamente']);
    }

    #[Route('/coche/{id}', name: 'actualizar_coche_estado_asignado', methods: ['PATCH'])]
    public function updateCocheEstado(int $id, Request $request, CocheRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $coche = $repo->find($id);
        if (!$coche) {
            return new JsonResponse(['detail' => 'Coche no encontrado'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (isset($data['estado'])) {
            $coche->setEstado($data['estado']);
        }

        $em->flush();
        return new JsonResponse(['message' => 'Estado del coche actualizado correctamente']);
    }



}
