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
        // Obtiene todos los usuarios de la base de datos
        $usuarios = $provinciaRepository->findAll();

        $context = [
            'circular_reference_handler' => function ($object, string $format, array $context) {
                // Devuelve, por ejemplo, el id del objeto en vez de seguir serializando la relación.
                return $object->getId();
            },
            'groups' => ['provincia:read']
            // Si usas grupos, también los puedes incluir:
            // 'groups' => 'usuario:read',
        ];

        // Serializa los usuarios con el contexto configurado
        $jsonUsuarios = $serializer->serialize($usuarios, 'json', $context);

        return new JsonResponse($jsonUsuarios, 200, [], true);
    }
}
