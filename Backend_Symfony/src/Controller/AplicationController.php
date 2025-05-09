<?php

namespace App\Controller;

use App\Entity\Usuario;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\NativePasswordHasher;

#[Route('/')]
final class AplicationController extends AbstractController
{
    
    #[Route('/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, UsuarioRepository $userRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return new JsonResponse(['error' => 'Faltan datos'], 400);
        }

        $usuario = $userRepository->findOneBy(['email' => $email]);

        if (!$usuario) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        if (!password_verify($password, $usuario->getPassword())) {
            return new JsonResponse(['detail' => 'Contraseña incorrecta'], 401);
        }

        return new JsonResponse([
            'message' => 'Login exitoso',
            'usuario' => [
                'id' => $usuario->getId(),
                'email' => $usuario->getEmail(),
                'nombre' => $usuario->getNombre()
            ]
        ], 200);
    }


    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        UsuarioRepository $userRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $nombre = $data['nombre'] ?? null;
        $apellidos = $data['apellidos'] ?? null;
        $email = $data['email'] ?? null;
        $password = password_hash($data['password'] ?? null, PASSWORD_DEFAULT);
        $telefono = $data['telefono'] ?? null;
        $dni = $data['dni'] ?? null;

        if (!$nombre || !$apellidos || !$email || !$password || !$telefono || !$dni) {
            return new JsonResponse(['error' => 'Faltan datos obligatorios'], 400);
        }

        // Verificar si el usuario ya existe
        if ($userRepository->findOneBy(['email' => $email])) {
            return new JsonResponse(['error' => 'Este email ya está registrado'], 409);
        }

        // Crear y guardar el usuario
        $usuario = new Usuario();
        $usuario->setNombre($nombre);
        $usuario->setApellidos($apellidos);
        $usuario->setEmail($email);
        $usuario->setPassword($password); // ¡OJO! sin hash
        $usuario->setTelefono($telefono);
        $usuario->setDni($dni);

        $entityManager->persist($usuario);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Usuario registrado con éxito',
            'usuario' => [
                'id' => $usuario->getId(),
                'email' => $usuario->getEmail(),
                'nombre' => $usuario->getNombre(),
                'apellidos' => $usuario->getApellidos()
            ]
        ], 201); // 201 Created
    }


    




}
