<?php

namespace App\Controller;

use App\Entity\Mecanico;
use App\Repository\AdministradorRepository;
use App\Repository\MecanicoRepository;
use Doctrine\ORM\EntityManagerInterface;
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

    #[Route('/mecanicos', name: 'crear_mecanico', methods: ['POST'])]
    public function crearMecanico(
        Request $request,
        EntityManagerInterface $em,
        AdministradorRepository $adminRepo,
        MecanicoRepository $mecanicoRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (
            !isset($data['nombre'], $data['apellidos'], $data['numEmp'], $data['password'], $data['adminId'])
        ) {
            return new JsonResponse(['detail' => 'Faltan campos obligatorios.'], 400);
        }

        $existe = $mecanicoRepository->findOneBy(['NumEmp' => $data['numEmp']]);
        if ($existe) {
            return new JsonResponse(['detail' => 'Ya existe un mecánico con ese número de empleado.'], 409);
        }

        $admin = $adminRepo->find($data['adminId']);
        if (!$admin) {
            return new JsonResponse(['detail' => 'Administrador no encontrado.'], 404);
        }

        $mecanico = new Mecanico();
        $mecanico->setNombre($data['nombre']);
        $mecanico->setApellidos($data['apellidos']);
        $mecanico->setNumEmp($data['numEmp']);
        $mecanico->setAdministrador($admin);

        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        $mecanico->setPassword($hashedPassword);

        $em->persist($mecanico);
        $em->flush();

        return new JsonResponse(['detail' => 'Mecánico creado correctamente'], 201);
    }



    #[Route('/mecanico/login', name: 'login_mecanico', methods: ['POST'])]
    public function login(Request $request, MecanicoRepository $repository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $numEmp = $data['numEmp'] ?? null;
        $password = $data['password'] ?? null;

        if (!$numEmp || !$password) {
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

    #[Route('/mecanico/{id}/delete', name: 'mecanico_delete', methods: ['DELETE'])]
    public function deleteUser(
        int $id,
        MecanicoRepository $mecanicoRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $mecanico = $mecanicoRepository->find($id);

        if (!$mecanico) {
            return new JsonResponse(['detail' => 'mecanico no encontrado'], 404);
        }

        foreach ($mecanico->getReparaciones() as $coche) {
            if (!$mecanico->getReparaciones()->isEmpty()) {
                return new JsonResponse(['detail' => 'No se puede eliminar el mecanico porque tiene reparaciones asociadas'], 400);
            }
        }

        $em->remove($mecanico);
        $em->flush();

        return new JsonResponse(['detail' => 'Mecanico eliminado correctamente'], 200);
    }
}
