<?php

namespace App\Controller;

use App\Entity\Usuario;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Ramsey\Uuid\Nonstandard\Uuid;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;

#[Route('/')]
final class AplicationController extends AbstractController
{
 #[Route('/', name: 'api_home')]
    public function index(): Response
    {
        return new Response('API CarCareNow está funcionando');
    }

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

        if (!$usuario->isConfirmado()) {
            return new JsonResponse(['error' => 'Debes confirmar tu cuenta por correo.'], 403);
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
        $passwordOriginal = $data['password'] ?? null;
        $telefono = $data['telefono'] ?? null;
        $dni = $data['dni'] ?? null;

        if (!$nombre || !$apellidos || !$email || !$passwordOriginal || !$telefono || !$dni) {
            return new JsonResponse(['error' => 'Faltan datos obligatorios'], 400);
        }

        if (!preg_match('/^[0-9]{9}$/', $telefono)) {
            return new JsonResponse(['error' => 'El teléfono debe tener exactamente 9 dígitos.'], 400);
        }

        if (!preg_match('/^[0-9]{8}[A-Z]$/', $dni)) {
            return new JsonResponse(['error' => 'El DNI debe tener 8 números seguidos de una letra mayúscula.'], 400);
        }

        if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$/', $passwordOriginal)) {
            return new JsonResponse([
                'error' => 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.'
            ], 400);
        }

        if ($userRepository->findOneBy(['email' => $email])) {
            return new JsonResponse(['error' => 'Este email ya está registrado'], 409);
        }

        $usuario = new Usuario();
        $usuario->setNombre($nombre);
        $usuario->setApellidos($apellidos);
        $usuario->setEmail($email);
        $usuario->setPassword(password_hash($passwordOriginal, PASSWORD_DEFAULT));
        $usuario->setTelefono($telefono);
        $usuario->setDni($dni);
        $usuario->setConfirmado(false);
        $usuario->setTokenConfirmacion(Uuid::uuid4()->toString());

        $entityManager->persist($usuario);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Usuario registrado con éxito. Revisa tu correo para confirmar la cuenta.',
            'usuario' => [
                'id' => $usuario->getId(),
                'email' => $usuario->getEmail(),
                'nombre' => $usuario->getNombre(),
                'apellidos' => $usuario->getApellidos()
            ]
        ], 201);
    }


}
