<?php

namespace App\Controller;

use App\Entity\Coche;
use App\Entity\Usuario;
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
        $usuarioId = $request->get('usuario'); // ⬅️ Recibimos el ID enviado desde React

        /** @var UploadedFile|null $imagenFile */
        $imagenFile = $request->files->get('imagen');

        // Buscar marca, modelo y usuario
        $marca = $marcaRepository->findOneBy(['nombre' => $marcaNombre]);
        $modelo = $modeloRepository->findOneBy(['nombre' => $modeloNombre]);
        $usuario = $usuarioRepository->find($usuarioId); // ⬅️ Buscamos el usuario

        if (!$marca || !$modelo || !$usuario) {
            return new JsonResponse(['detail' => 'Marca, modelo o usuario no encontrado'], 400);
        }

        if (!$imagenFile) {
            return new JsonResponse(['detail' => 'No se recibió ninguna imagen'], 400);
        }

        // Crear entidad Coche
        $coche = new Coche();
        $coche->setMarca($marca);
        $coche->setModelo($modelo);
        $coche->setUsuario($usuario);
        $coche->setAño((int) $año);

        // Guardar imagen
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
        $coche = $usuario->getCoches()->first(); // Suponiendo relación OneToMany
        if (!$coche) {
            return new JsonResponse(['detail' => 'Sin coche'], 404);
        }

        $json = $serializer->serialize($coche, 'json', ['groups' => ['coche:read']]);
        return new JsonResponse($json, 200, [], true);
    }

}
