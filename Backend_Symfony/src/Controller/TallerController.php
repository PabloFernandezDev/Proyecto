<?php

namespace App\Controller;

use App\Repository\TallerRepository;
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
            'circular_reference_handler' => fn ($object) => $object->getId(),
        ];

        $json = $serializer->serialize($talleres, 'json', $context);
        return new JsonResponse($json, 200, [], true);
    }

}
