<?php

namespace App\Controller;

use App\Repository\AdministradorRepository;
use App\Repository\MecanicoRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/')]
final class MecanicoController extends AbstractController
{

    #[Route('/mecanicos', name: 'mecanicos', methods: ['GET'])]
    public function mecanicos(MecanicoRepository $mecanicoRepository, SerializerInterface $serializer): JsonResponse
    {
        $usuarios = $mecanicoRepository->findAll();

        $context = [
            'circular_reference_handler' => function ($object, string $format, array $context) {
                return $object->getId();
            },
            'groups' => ['mecanico:read']
        ];

        $jsonMecanicos = $serializer->serialize($usuarios, 'json', $context);

        return new JsonResponse($jsonMecanicos, 200, [], true);
    }

    #[Route('/mecanico/login', name: 'login_mecanico', methods: ['POST'])]
    public function login(Request $request, MecanicoRepository $repository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $numEmp =  $data['numEmp'] ?? null;
        $password = $data['password'] ?? null;

        if (!$numEmp || !$password ) {
            return $this->json(['detail' => 'Parámetros inválidos'], 400);
        }

        $usuario = $repository->findOneBy(['NumEmp' => $numEmp]);

        if (!$usuario || $usuario->getPassword() !== $password) {
            return $this->json(['detail' => 'Credenciales incorrectas'], 401);
        }

        return $this->json([
            'id' => $usuario->getId(),
            'numEmp' => $usuario->getNumEmp()
        ], 200);
    }

    #[Route('/admin/{id}/mecanicos', name: 'admin_mecanicos', methods: ['GET'])]
    public function getMecanicosPorAdmin(
        int $id,
        AdministradorRepository $administradorRepository,
        MecanicoRepository $mecanicoRepository
    ): JsonResponse {
        $admin = $administradorRepository->find($id);

        if (!$admin) {
            return new JsonResponse(['error' => 'Administrador no encontrado'], 404);
        }

        $mecanicos = $mecanicoRepository->findBy(['administrador' => $admin]);

        $datos = array_map(function ($mec) {
            return [
                'id' => $mec->getId(),
                'Nombre' => $mec->getNombre(),
                'Apellidos' => $mec->getApellidos(),
                'numEmp' => $mec->getNumEmp(),
            ];
        }, $mecanicos);

        return new JsonResponse($datos, 200);
    }
}
