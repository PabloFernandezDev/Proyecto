<?php

namespace App\Controller;

use App\Repository\MarcaRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/')]

final class ModeloController extends AbstractController
{
    #[Route('/marca/{nombre}/modelos', name: 'marca_modelos', methods: ['GET'])]
    public function obtenerModelos(
        string $nombre,
        MarcaRepository $marcaRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $marca = $marcaRepository->findOneBy(['nombre' => $nombre]);

        if (!$marca) {
            return new JsonResponse(['detail' => 'Marca no encontrada'], 404);
        }

        $modelos = $marca->getModelos(); // Suponiendo que tienes una relación Marca->Modelos

        $context = [
            'groups' => ['modelo:read']
        ];

        $json = $serializer->serialize($modelos, 'json', $context);

        return new JsonResponse($json, 200, [], true);
    }
}
