<?php

namespace App\Controller;

use App\Repository\MarcaRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/')]
final class MarcaController extends AbstractController
{
    #[Route('/marca', name: 'marca', methods: ['GET'])]
    public function marca(MarcaRepository $marcaRepository, SerializerInterface $serializer): JsonResponse
    {
        $marcas = $marcaRepository->findAll();

        $context = [
            'circular_reference_handler' => function ($object, string $format, array $context) {
                return $object->getId();
            },
            'groups' => ['marca:read']
        ];

        $jsonUsuarios = $serializer->serialize($marcas, 'json', $context);

        return new JsonResponse($jsonUsuarios, 200, [], true);
    }
}
