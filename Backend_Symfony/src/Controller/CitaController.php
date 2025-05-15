<?php

namespace App\Controller;

use App\Entity\Cita;
use App\Repository\AdministradorRepository;
use App\Repository\CitaRepository;
use App\Repository\ProvinciaRepository;
use App\Repository\TallerRepository;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/')]
final class CitaController extends AbstractController
{
    #[Route('/citas', name: 'crear_cita', methods: ['POST'])]
    public function crearCita(
        Request $request,
        EntityManagerInterface $em,
        UsuarioRepository $usuarioRepo,
        ProvinciaRepository $provinciaRepository
    ): JsonResponse {
        $datos = json_decode($request->getContent(), true);

        if (!$datos || !isset($datos['provincia'], $datos['fecha'], $datos['hora'], $datos['motivo'], $datos['userId'])) {
            return new JsonResponse(['error' => 'Faltan datos obligatorios.'], 400);
        }

        $usuario = $usuarioRepo->find($datos['userId']);
        if (!$usuario) {
            return new JsonResponse(['error' => 'Usuario no encontrado.'], 404);
        }

        $provincia = $provinciaRepository->findOneBy(['nombre' => $datos['provincia']]);


        if (!$provincia) {
            return new JsonResponse(['error' => 'Provincia no encontrado.'], 404);
        }

        try {
            $fecha = new \DateTime($datos['fecha']);
            $hora = new \DateTime($datos['hora']);

            $cita = new Cita();
            $cita->setUsuario($usuario);
            $cita->setProvincia($provincia);
            $cita->setFecha($fecha);
            $cita->setHora($hora);
            $cita->setMotivo($datos['motivo']);

            $em->persist($cita);
            $em->flush();

            return new JsonResponse(['mensaje' => 'Cita creada correctamente'], 201);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Error al crear la cita.'], 500);
        }
    }

    #[Route('/admin/{adminId}/taller/{provinciaId}/citas', name: 'citas_taller_por_admin', methods: ['GET'])]
    public function citasPorTallerYAdmin(
        int $adminId,
        int $provinciaId,
        AdministradorRepository $adminRepo,
        ProvinciaRepository $provinciaRepository,
        CitaRepository $citaRepo,
        SerializerInterface $serializer
    ): JsonResponse {
        $admin = $adminRepo->find($adminId);
        $provincia = $provinciaRepository->find($provinciaId);

        if (!$admin || !$provincia) {
            return $this->json(['detail' => 'Administrador o taller no encontrado'], 404);
        }

        if ($admin->getTaller()?->getProvincia()?->getId() !== $provincia->getId()) {
            return $this->json(['detail' => 'Este administrador no pertenece a este taller'], 403);
        }

        $citas = $citaRepo->findBy(['provincia' => $provincia]);

        $context = [
            'groups' => ['cita:read'],
            'circular_reference_handler' => fn($object) => $object->getId(),
        ];

        $json = $serializer->serialize($citas, 'json', $context);

        return new JsonResponse($json, 200, [], true);
    }

    #[Route('/cita/{id}/delete', name: 'cita_delete', methods: ['DELETE'])]
    public function deleteCita(int $id, CitaRepository $citaRepository, EntityManagerInterface $em): JsonResponse
    {
        $cita = $citaRepository->find($id);

        if (!$cita) {
            return new JsonResponse(['detail' => 'Cita no encontrada'], 404);
        }

        $em->remove($cita);
        $em->flush();

        return new JsonResponse(['detail' => 'Cita eliminada correctamente'], 200);
    }

    #[Route('/cita/{id}', name: 'cita_delete', methods: ['GET'])]
    public function getCita(int $id, CitaRepository $citaRepository, SerializerInterface $serializer): JsonResponse
    {
        $cita = $citaRepository->find($id);

        if (!$cita) {
            return new JsonResponse(['detail' => 'Cita no encontrada'], 404);
        }

        $context = [
            'groups' => ['cita:read'],
            'circular_reference_handler' => fn($object) => $object->getId(),
        ];

        $json = $serializer->serialize($cita, 'json', $context);

        return new JsonResponse($json, 200, [], true);
    }


}
