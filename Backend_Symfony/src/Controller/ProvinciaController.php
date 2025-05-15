<?php

namespace App\Controller;

use App\Repository\ProvinciaRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/')]
final class ProvinciaController extends AbstractController
{
    #[Route('/provincias', name: 'app_provincia', methods: ['GET'])]
    public function users(ProvinciaRepository $provinciaRepository, SerializerInterface $serializer): JsonResponse
    {
        $usuarios = $provinciaRepository->findAll();

        $context = [
            'circular_reference_handler' => function ($object, string $format, array $context) {
                return $object->getId();
            },
            'groups' => ['provincia:read']
        ];

        $jsonUsuarios = $serializer->serialize($usuarios, 'json', $context);

        return new JsonResponse($jsonUsuarios, 200, [], true);
    }
}
