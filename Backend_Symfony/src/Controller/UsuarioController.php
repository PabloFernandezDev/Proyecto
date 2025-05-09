<?php

namespace App\Controller;

use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/')]
final class UsuarioController extends AbstractController
{
    #[Route('/users', name: 'users', methods: ['GET'])]
    public function users(UsuarioRepository $userRepository, SerializerInterface $serializer): JsonResponse
    {
        // Obtiene todos los usuarios de la base de datos
        $usuarios = $userRepository->findAll();

        $context = [
            'circular_reference_handler' => function ($object, string $format, array $context) {
                // Devuelve, por ejemplo, el id del objeto en vez de seguir serializando la relación.
                return $object->getId();
            },
            'groups' => ['usuario:read']
            // Si usas grupos, también los puedes incluir:
            // 'groups' => 'usuario:read',
        ];

        // Serializa los usuarios con el contexto configurado
        $jsonUsuarios = $serializer->serialize($usuarios, 'json', $context);

        return new JsonResponse($jsonUsuarios, 200, [], true);
    }

    #[Route('/user/{userId}', name: 'user', methods: ['GET'])]
    public function user(
        int $userId,
        UsuarioRepository $userRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $usuario = $userRepository->find($userId);

        if (!$usuario) {
            return new JsonResponse(['detail' => 'Usuario no encontrado'], 404);
        }

        $context = [
            'circular_reference_handler' => function ($object, string $format, array $context) {
                return $object->getId();
            },
            'groups' => ['usuario:read']
        ];

        $jsonUsuario = $serializer->serialize($usuario, 'json', $context);

        return new JsonResponse($jsonUsuario, 200, [], true);
    }

    #[Route('/user/{id}', name: 'user_update', methods: ['PUT'])]
    public function updateUser(
        int $id,
        Request $request,
        UsuarioRepository $usuarioRepository,
        EntityManagerInterface $em,
        SerializerInterface $serializer
    ): JsonResponse {
        $usuario = $usuarioRepository->find($id);

        if (!$usuario) {
            return new JsonResponse(['detail' => 'Usuario no encontrado'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return new JsonResponse(['detail' => 'Datos inválidos'], 400);
        }

        // Actualizamos los campos (ajusta según tus necesidades)
        $usuario->setNombre($data['nombre'] ?? $usuario->getNombre());
        $usuario->setApellidos($data['apellidos'] ?? $usuario->getApellidos());
        $usuario->setEmail($data['email'] ?? $usuario->getEmail());
        $usuario->setTelefono($data['telefono'] ?? $usuario->getTelefono());
        $usuario->setDni($data['dni'] ?? $usuario->getDni());

        $em->persist($usuario);
        $em->flush();

        $context = ['groups' => ['usuario:read']];
        $json = $serializer->serialize($usuario, 'json', $context);

        return new JsonResponse($json, 200, [], true);
    }

    #[Route('/user/{id}/password', name: 'user_change_password', methods: ['PUT'])]
    public function changePassword(
        int $id,
        Request $request,
        UsuarioRepository $usuarioRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $usuario = $usuarioRepository->find($id);

        if (!$usuario) {
            return new JsonResponse(['detail' => 'Usuario no encontrado'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $nuevaPassword = $data['password'] ?? null;

        if (!$nuevaPassword ) {
            return new JsonResponse(['detail' => 'La contraseña debe tener al menos 6 caracteres'], 400);
        }

        // ⚠️ Codificación manual de la contraseña (sólo para desarrollo):
        $hashedPassword = password_hash($nuevaPassword, PASSWORD_DEFAULT);

        $usuario->setPassword($hashedPassword);
        $em->flush();

        return new JsonResponse(['detail' => 'Contraseña actualizada correctamente'], 200);
    }


    #[Route('/user/{id}', name: 'user_delete', methods: ['DELETE'])]
    public function deleteUser(
        int $id,
        UsuarioRepository $usuarioRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $usuario = $usuarioRepository->find($id);

        if (!$usuario) {
            return new JsonResponse(['detail' => 'Usuario no encontrado'], 404);
        }

        $em->remove($usuario);
        $em->flush();

        return new JsonResponse(['detail' => 'Usuario eliminado correctamente'], 200);
    }
    
}
