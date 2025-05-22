<?php

namespace App\Controller;

use App\Entity\Coche;
use App\Entity\Usuario;
use App\Repository\AdministradorRepository;
use App\Repository\CocheRepository;
use App\Repository\MarcaRepository;
use App\Repository\ModeloRepository;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/')]
final class CocheController extends AbstractController
{
    #[Route('/coche', name: 'coche_add', methods: ['POST'])]
    public function addCoche(
        Request $request,
        EntityManagerInterface $em,
        MarcaRepository $marcaRepository,
        ModeloRepository $modeloRepository,
        UsuarioRepository $usuarioRepository,
        SluggerInterface $slugger
    ): JsonResponse {
        $marcaNombre = $request->get('marca');
        $modeloNombre = $request->get('modelo');
        $año = $request->get('año');
        $usuarioId = $request->get('usuario');
        $matricula = $request->get('matricula');

        $imagenFile = $request->files->get('imagen');

        $marca = $marcaRepository->findOneBy(['nombre' => $marcaNombre]);
        $modelo = $modeloRepository->findOneBy(['nombre' => $modeloNombre]);
        $usuario = $usuarioRepository->find($usuarioId);

        if (!$marca || !$modelo || !$usuario) {
            return new JsonResponse(['detail' => 'Marca, modelo o usuario no encontrado'], 400);
        }

        if (!$imagenFile) {
            return new JsonResponse(['detail' => 'No se recibió ninguna imagen'], 400);
        }

        $coche = new Coche();
        $coche->setMarca($marca);
        $coche->setModelo($modelo);
        $coche->setUsuario($usuario);
        $coche->setMatricula($matricula);
        $coche->setAño((int) $año);

        $safeName = $slugger->slug(pathinfo($imagenFile->getClientOriginalName(), PATHINFO_FILENAME));
        $newFilename = $safeName . '-' . uniqid() . '.' . $imagenFile->guessExtension();

        try {
            $imagenFile->move(
                $this->getParameter('upload_directory_images'),
                $newFilename
            );
            $coche->setImagen($newFilename);
        } catch (FileException $e) {
            return new JsonResponse(['detail' => 'Error al subir imagen'], 500);
        }

        $em->persist($coche);
        $em->flush();

        return new JsonResponse(['detail' => 'Coche añadido correctamente'], 201);
    }


    #[Route('/user/{id}/coche', name: 'user_car', methods: ['GET'])]
    public function getUserCar(Usuario $usuario, SerializerInterface $serializer): JsonResponse
    {
        $coche = $usuario->getCoches()->first();
        if (!$coche) {
            return new JsonResponse(['detail' => 'Sin coche'], 404);
        }

        $json = $serializer->serialize($coche, 'json', ['groups' => ['coche:read']]);
        return new JsonResponse($json, 200, [], true);
    }

    #[Route('/coche/{id}', name: 'coche_delete', methods: ['DELETE'])]
    public function deleteCoche(int $id, CocheRepository $cocheRepository, EntityManagerInterface $em): JsonResponse
    {
        $coche = $cocheRepository->find($id);

        if (!$coche) {
            return new JsonResponse(['detail' => 'Coche no encontrado'], 404);
        }

        $em->remove($coche);
        $em->flush();

        return new JsonResponse(['detail' => 'Coche eliminado correctamente'], 200);
    }

    #[Route('/admin/{id}/coches', name: 'admin_mecanicos', methods: ['GET'])]
    public function mecanicosPorAdmin(
        int $id,
        AdministradorRepository $adminRepo,
        SerializerInterface $serializer
    ): JsonResponse {
        $admin = $adminRepo->find($id);

        if (!$admin) {
            return $this->json(['detail' => 'Administrador no encontrado'], 404);
        }

        $mecanicos = $admin->getMecanicos();


        $context = [
            'circular_reference_handler' => fn($object, string $format, array $context) => $object->getId(),
            'groups' => ['mecanico:read'],
            'enable_max_depth' => true
        ];


        $json = $serializer->serialize($mecanicos, 'json', $context);
        return new JsonResponse($json, 200, [], true);
    }




    #[Route('/user/coche/{id}/reparaciones', name: 'userCocheReparaciones', methods: ['GET'])]
    public function userCocheReparaciones(int $id, CocheRepository $cocheRepository, SerializerInterface $serializer): JsonResponse
    {
        $coches = $cocheRepository->find($id);

        $context = [
            'circular_reference_handler' => function ($object, string $format, array $context) {
                return $object->getId();
            },
            'groups' => ['coches:read']

        ];

        $jsonCoches = $serializer->serialize($coches, 'json', $context);

        return new JsonResponse($jsonCoches, 200, [], true);
    }

    #[Route('/coche/{id}/devolver', name: 'user_coche_devolver', methods: ['PATCH'])]
    public function devolverCoche(
        int $id,
        EntityManagerInterface $em,
        CocheRepository $cocheRepository
    ): JsonResponse {
        $coche = $cocheRepository->find($id);

        if (!$coche) {
            return new JsonResponse(['error' => 'Coche no encontrado'], 404);
        }

        $usuario = $coche->getUsuario();

        // Borrar reparaciones del coche
        foreach ($coche->getReparaciones() as $reparacion) {
            $em->remove($reparacion);
        }

        // Borrar citas asociadas a este coche (si la cita tiene coche)
        if ($usuario) {
            foreach ($usuario->getCitas() as $cita) {
                if ($cita->getCoche() && $cita->getCoche()->getId() === $id) {
                    $em->remove($cita);
                }
            }
        }

        // Desasociar el taller
        $coche->setTaller(null);

        $em->flush();

        return new JsonResponse(['mensaje' => 'Coche marcado como devuelto y citas eliminadas']);
    }

}
