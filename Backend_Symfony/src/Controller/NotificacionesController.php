<?php

namespace App\Controller;

use App\Entity\Notificacion;
use App\Repository\NotificacionRepository;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/')]
final class NotificacionesController extends AbstractController
{
    #[Route('/notificacion', name: 'crear_notificacion', methods: ['POST'])]
    public function crear(
        Request $request,
        EntityManagerInterface $em,
        UsuarioRepository $usuarioRepo
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $usuarioId = $data['usuarioId'] ?? null;
        $mensaje = $data['mensaje'] ?? null;
        $tipo = $data['tipo'] ?? null;

        if (!$usuarioId || !$mensaje) {
            return new JsonResponse(['error' => 'Faltan datos obligatorios'], 400);
        }

        $usuario = $usuarioRepo->find($usuarioId);
        if (!$usuario) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        $notificacion = new Notificacion();
        $notificacion->setUsuario($usuario);
        $notificacion->setMensaje($mensaje);
        $notificacion->setFecha(new \DateTime());
        $notificacion->setLeido(false);
        $notificacion->setTipo($tipo);

        $em->persist($notificacion);
        $em->flush();

        return new JsonResponse(['mensaje' => 'Notificación creada correctamente'], 201);
    }

    #[Route('/user/{id}/notificaciones', name: 'notificaciones_usuario', methods: ['GET'])]
    public function obtenerPorUsuario(
        int $id,
        UsuarioRepository $usuarioRepo,
        NotificacionRepository $notificacionRepo
    ): JsonResponse {
        $usuario = $usuarioRepo->find($id);
        if (!$usuario) {
            return $this->json(['error' => 'Usuario no encontrado'], 404);
        }

        $notificaciones = $notificacionRepo->findBy(
            ['Usuario' => $usuario],
            ['fecha' => 'ASC']
        );

        return $this->json($notificaciones, 200, [], ['groups' => 'notificacion:read']);
    }

    #[Route('/notificaciones/{id}/leido', name: 'notificacion_marcar_leido', methods: ['PATCH'])]
    public function marcarLeido(int $id, NotificacionRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $noti = $repo->find($id);

        if (!$noti) {
            return $this->json(['error' => 'Notificación no encontrada'], 404);
        }

        $noti->setLeido(true);
        $em->flush();

        return $this->json(['mensaje' => 'Notificación marcada como leída']);
    }

}
