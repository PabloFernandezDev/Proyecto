<?php

namespace App\Controller;

use App\Entity\Reparaciones;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/')]
final class ReparacionesController extends AbstractController
{
    #[Route('/reparaciones/{id}', name: 'borrar_reparacion', methods: ['DELETE'])]
    public function borrarReparacion(Reparaciones $reparacion, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($reparacion);
        $em->flush();

        return new JsonResponse(null, 204);
    }

}
