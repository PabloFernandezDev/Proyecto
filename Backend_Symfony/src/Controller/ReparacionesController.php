<?php

namespace App\Controller;

use App\Entity\Reparaciones;
use App\Repository\CocheRepository;
use App\Repository\MecanicoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
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

    #[Route('/reparaciones', name: 'crear_reparaciones', methods: ['POST'])]
    public function crearReparaciones(
        Request $request,
        EntityManagerInterface $em,
        CocheRepository $cocheRepo,
        MecanicoRepository $mecanicoRepo
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $coche = $cocheRepo->find($data['cocheId']);
        $mecanico = $mecanicoRepo->find($data['mecanicoId']);
        $estado = $data['estado'] ?? 'En revisión';
        $fechaInicio = new \DateTime($data['fechaInicio']);
        $tareas = $data['tareas'] ?? [];

        if (!$coche || !$mecanico || empty($tareas)) {
            return $this->json(['detail' => 'Datos inválidos'], 400);
        }

        foreach ($tareas as $descripcion) {
            $reparacion = new Reparaciones();
            $reparacion->setCoche($coche);
            $reparacion->setMecanico($mecanico);
            $reparacion->setEstado($estado);
            $reparacion->setFechaInicio($fechaInicio);
            $reparacion->setDescripcion($descripcion); // 👈 ¡Este es obligatorio!

            $em->persist($reparacion);
        }

        $em->flush();

        return $this->json(['message' => 'Reparaciones registradas correctamente'], 201);
    }



}
