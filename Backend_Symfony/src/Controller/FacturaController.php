<?php

namespace App\Controller;

use App\Entity\Factura;
use App\Entity\LineaFactura;
use App\Repository\FacturaRepository;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/')]
final class FacturaController extends AbstractController
{
    #[Route('/factura/generar/{usuarioId}', name: 'generar_factura', methods: ['POST'])]
    public function generarFactura(
        int $usuarioId,
        EntityManagerInterface $em,
        UsuarioRepository $usuarioRepo
    ): JsonResponse {
        $usuario = $usuarioRepo->find($usuarioId);

        if (!$usuario) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        $factura = new Factura();
        $factura->setUsuario($usuario);
        $factura->setNumero('FAC-' . strtoupper(uniqid()));
        $factura->setMetodoPago('Tarjeta');
        $factura->setFecha(new \DateTime());

        $subtotal = 0;

        foreach ($usuario->getCoches() as $coche) {
            foreach ($coche->getReparaciones() as $reparacion) {
                if ($reparacion->getEstado() !== 'Finalizado') {
                    continue;
                }

                $linea = new LineaFactura();
                $linea->setConcepto('Reparación');
                $linea->setDescripcion($reparacion->getDescripcion());
                $linea->setCantidad(1);
                $linea->setPrecio($reparacion->getPrecio());
                $linea->setTotal($reparacion->getPrecio());
                $linea->setFactura($factura);

                $subtotal += $reparacion->getPrecio();
                $em->persist($linea);
                $factura->getLineasFacturas()->add($linea);
            }
        }

        if ($subtotal === 0) {
            return new JsonResponse(['error' => 'No hay reparaciones finalizadas para facturar'], 400);
        }

        $iva = $subtotal * 0.21;
        $total = $subtotal + $iva;

        $factura->setSubtotal($subtotal);
        $factura->setIva($iva);
        $factura->setTotal($total);

        $em->persist($factura);
        $em->flush();

        return new JsonResponse([
            'message' => 'Factura generada correctamente',
            'facturaId' => $factura->getId()
        ]);
    }

    #[Route('/facturas/{usuarioId}', name: 'facturas_por_usuario', methods: ['GET'])]
    public function facturasPorUsuario(
        int $usuarioId,
        UsuarioRepository $usuarioRepo,
        SerializerInterface $serializer
    ): JsonResponse {
        $usuario = $usuarioRepo->find($usuarioId);

        if (!$usuario) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        $facturas = $usuario->getFacturas();

        $json = $serializer->serialize($facturas, 'json', ['groups' => 'facturas:read']);

        return new JsonResponse(json_decode($json), 200);
    }

    #[Route('/factura/{id}', name: 'factura_detalle', methods: ['GET'])]
    public function factura(
        int $id,
        FacturaRepository $facturaRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $factura = $facturaRepository->find($id);

        if (!$factura) {
            return new JsonResponse(['error' => 'Factura no encontrada'], 404);
        }

        $json = $serializer->serialize($factura, 'json', ['groups' => 'factura:read']);

        return new JsonResponse(json_decode($json), 200);
    }

}
