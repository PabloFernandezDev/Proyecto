<?php

namespace App\Controller;

use App\Entity\Reparaciones;
use App\Repository\CocheRepository;
use App\Repository\MecanicoRepository;
use App\Repository\ReparacionesRepository;
use App\Repository\TallerRepository;
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
        MecanicoRepository $mecanicoRepo,
        TallerRepository $tallerRepository,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['detail' => 'JSON inválido'], 400);
        }

        $coche = $cocheRepo->find($data['cocheId']);
        $mecanico = $mecanicoRepo->find($data['mecanicoId']);
        $taller = $tallerRepository->find($data['taller']);
        $fechaEntrega = new \DateTime($data['fechaEntrega']);
        $fechaInicio = new \DateTime($data['fechaInicio']);
        $tareas = $data['tareas'] ?? [];


        if (!$coche || !$mecanico || empty($tareas)) {
            return $this->json(['detail' => 'Datos inválidos'], 400);
        }

        if (!$taller) {
            return $this->json([
                'detail' => 'Taller no encontrado',
                'tallerRecibido' => $data['taller'] ?? null
            ], 400);
        }

        foreach ($tareas as $tarea) {
            if (empty($tarea['descripcion'])) {
                continue;
            }

            $reparacion = new Reparaciones();
            $reparacion->setCoche($coche);
            $reparacion->setMecanico($mecanico);
            $reparacion->setEstado("Sin empezar");
            $reparacion->setFechaInicio($fechaInicio);
            $reparacion->setFechaFin($fechaEntrega);
            $reparacion->setDescripcion($tarea['descripcion']);

            $em->persist($reparacion);
        }

        $coche->setTaller($taller);

        $em->flush();

        return $this->json([
            'message' => 'Reparaciones registradas correctamente'
        ], 201);
    }


    #[Route('/reparacion/{id}/estado', name: 'actualizar_estado_reparacion', methods: ['PATCH'])]
    public function actualizarEstadoReparacion(
        int $id,
        Request $request,
        EntityManagerInterface $em,
        ReparacionesRepository $reparacionRepo
    ): JsonResponse {
        $reparacion = $reparacionRepo->find($id);

        if (!$reparacion) {
            return new JsonResponse(['error' => 'Reparación no encontrada'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $estado = $data['estado'] ?? null;

        $reparacion->setEstado($estado);
        $em->flush();

        return new JsonResponse([
            'message' => 'Estado de reparación actualizado correctamente',
            'nuevoEstado' => $reparacion->getEstado()
        ]);
    }




}
