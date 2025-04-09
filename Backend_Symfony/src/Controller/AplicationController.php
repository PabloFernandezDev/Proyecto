<?php

namespace App\Controller;

use App\Entity\Usuario;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class AplicationController extends AbstractController
{
    #[Route('/users', name: 'users_index')]
    public function index(UsuarioRepository $userRepository, SerializerInterface $serializer): JsonResponse
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

    #[Route('/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request,UsuarioRepository $userRepository): JsonResponse {
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

        //Cambia esto
        if ("password123"!= $password) {
            return new JsonResponse(['error' => 'Contraseña incorrecta'], 401);
        }

        return new JsonResponse(['message' => 'Login exitoso', 'usuario' => $usuario], 200);
    }

    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request, 
        UsuarioRepository $userRepository, 
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        
        $nombre = $data['nombre'] ?? null;
        $apellidos = $data['apellidos'] ?? null;
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;
        $telefono = $data['telefono'] ?? null;
        $dni = $data['dni'] ?? null;
        
        if (!$nombre || !$apellidos || !$email || !$password || !$telefono || !$dni) {
            return new JsonResponse(['error' => 'Faltan datos obligatorios'], 400);
        }
        
        // Comprobar si el usuario ya existe
        $usuarioExistente = $userRepository->findOneBy(['email' => $email]);
        
        if ($usuarioExistente) {
            return new JsonResponse(['error' => 'Este email ya está registrado'], 409); // 409 Conflict
        }
        
        // Crear nuevo usuario
        $usuario = new Usuario();
        $usuario->setNombre($nombre);
        $usuario->setApellidos($apellidos);
        $usuario->setEmail($email);
        // Encriptar la contraseña
        $usuario->setPassword($password);
        $usuario->setTelefono($telefono);
        $usuario->setDni($dni);
        
        // Guardar en la base de datos
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
        ], 200); // 201 Created
    }

}
