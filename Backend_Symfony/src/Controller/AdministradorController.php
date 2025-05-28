<?php

namespace App\Controller;

use App\Entity\Administrador;
use App\Entity\Mecanico;
use App\Repository\AdministradorRepository;
use App\Repository\TallerRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/')]
final class AdministradorController extends AbstractController
{

    #[Route('/admins', name: 'admins', methods: ['GET'])]
    public function mecanicos(AdministradorRepository $administradorRepository, SerializerInterface $serializer): JsonResponse
    {
        $admins = $administradorRepository->findAll();

        $context = [
            'circular_reference_handler' => function ($object, string $format, array $context) {
                return $object->getId();
            },
            'groups' => ['admins:read']
        ];

        $jsonMecanicos = $serializer->serialize($admins, 'json', $context);

        return new JsonResponse($jsonMecanicos, 200, [], true);
    }

    #[Route('/admin', name: 'admin_create', methods: ['POST'])]
    public function createAdmin(
        Request $request,
        EntityManagerInterface $em,
        AdministradorRepository $adminRepo,
        TallerRepository $tallerRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (
            !isset($data['Nombre'], $data['Apellidos'], $data['NumEmp'], $data['password'], $data['tallerId'])
        ) {
            return new JsonResponse(['error' => 'Datos incompletos'], 400);
        }

        if ($adminRepo->findOneBy(['NumEmp' => $data['NumEmp']])) {
        return new JsonResponse(['detail' => 'Ya existe un administrador con ese número de empleado'], 400);
    }

        $taller = $tallerRepository->find($data['tallerId']);
        if (!$taller) {
            return new JsonResponse(['error' => 'Taller no encontrado'], 404);
        }

        $admin = new Administrador();
        $admin->setNombre($data['Nombre']);
        $admin->setApellidos($data['Apellidos']);
        $admin->setNumEmp($data['NumEmp']);
        $admin->setTaller($taller);
        $admin->setRol('ADMIN');

        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        $admin->setPassword($hashedPassword);

        $em->persist($admin);
        $em->flush();

        $json = $serializer->serialize($admin, 'json', ['groups' => 'admins:read']);
        return new JsonResponse(json_decode($json), 201);
    }


    #[Route('/admin/login', name: 'login_admin', methods: ['POST'])]
    public function login(Request $request, AdministradorRepository $repository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $numEmp = $data['numEmp'] ?? null;
        $password = $data['password'] ?? null;

        if (!$numEmp || !$password) {
            return $this->json(['detail' => 'Parámetros inválidos'], 400);
        }

        $admin = $repository->findOneBy(['NumEmp' => $numEmp]);

        if (!password_verify($password, $admin->getPassword())) {
            return $this->json(['detail' => 'Credenciales incorrectas'], 401);
        }

        return $this->json([
            'id' => $admin->getId(),
            'numEmp' => $admin->getNumEmp(),
            'rol' => $admin->getRol(),
            'provincia' => [
                'id' => $admin->getTaller()?->getProvincia()?->getId(),
                'nombre' => $admin->getTaller()?->getProvincia()?->getNombre()
            ],
            'taller' => [
                'id' => $admin->getTaller()?->getId(),
                'nombre' => $admin->getTaller()?->getDireccion()
            ]
        ], 200);
    }

    #[Route('/admin/{id}/delete', name: 'admin_delete', methods: ['DELETE'])]
    public function deleteAdmin(
        int $id,
        AdministradorRepository $adminRepo,
        EntityManagerInterface $em
    ): JsonResponse {
        $admin = $adminRepo->find($id);

        if (!$admin) {
            return new JsonResponse(['error' => 'Administrador no encontrado'], 404);
        }

        if (!$admin->getMecanicos()->isEmpty()) {
            return new JsonResponse([
                'detail' => 'Este administrador tiene mecánicos asignados y no puede ser eliminado.'
            ], 400);
        }

        $em->remove($admin);
        $em->flush();

        return new JsonResponse(['message' => 'Administrador eliminado correctamente'], 200);
    }
}
