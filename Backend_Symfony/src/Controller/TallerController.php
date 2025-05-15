<?php

namespace App\Controller;

use App\Entity\Coche;
use App\Repository\AdministradorRepository;
use App\Repository\CocheRepository;
use App\Repository\MecanicoRepository;
use App\Repository\TallerRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/')]
final class TallerController extends AbstractController
{
    #[Route('/talleres', name: 'talleres', methods: ['GET'])]
    public function obtenerTalleresConUbicacion(TallerRepository $tallerRepository, SerializerInterface $serializer): JsonResponse
    {
        $talleres = $tallerRepository->findAll();

        $context = [
            'groups' => ['taller:read'],
            'circular_reference_handler' => fn($object) => $object->getId(),
        ];

        $json = $serializer->serialize($talleres, 'json', $context);
        return new JsonResponse($json, 200, [], true);
    }

    #[Route('/taller/{id}/mecanicos', name: 'taller_mecanicos', methods: ['GET'])]
    public function mecanicosPorTaller(
        int $id,
        AdministradorRepository $adminRepo,
        SerializerInterface $serializer
    ): JsonResponse {
        $admin = $adminRepo->findOneBy(['taller' => $id]);

        if (!$admin) {
            return $this->json(['detail' => 'Administrador no encontrado para este taller'], 404);
        }

        $context = [
            'groups' => ['taller:read'],
            'circular_reference_handler' => fn($object) => $object->getId()
        ];

        $json = $serializer->serialize($admin, 'json', $context);

        return new JsonResponse($json, 200, [], true);
    }


    #[Route('/taller/{id}/cochesdisponibles', name: 'taller_coches_disponibles', methods: ['GET'])]
    public function cochesSinReparaciones(
        int $id,
        SerializerInterface $serializer,
        CocheRepository $cocheRepository
    ): JsonResponse {
        
        $coches = $cocheRepository->findBy(['taller' => $id]);

        $context = [
            'groups' => ['coches:read'],
            'circular_reference_handler' => fn($object) => $object->getId()
        ];

        return new JsonResponse(
            $serializer->serialize($coches, 'json', $context),
            200,
            [],
            true
        );
    }



}
