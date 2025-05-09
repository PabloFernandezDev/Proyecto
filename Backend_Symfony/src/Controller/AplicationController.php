<?php

namespace App\Controller;

use App\Entity\Coche;
use App\Entity\Usuario;
use App\Repository\MarcaRepository;
use App\Repository\ModeloRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;

final class AplicationController extends AbstractController
{
    #[Route('/users', name: 'users_index', methods: ['GET'])]
    public function index(UsuarioRepository $userRepository, SerializerInterface $serializer): JsonResponse
    {
        // Obtiene todos los usuarios de la base de datos
        $usuarios = $userRepository->findAll();

        $context = [
            'circular_reference_handler' => function ($object, string $format, array $context) {
                // Devuelve, por ejemplo, el id del objeto en vez de seguir serializando la relación.
                return $object->getId();
            },
            'groups' => ['usuario:read']
            // Si usas grupos, también los puedes incluir:
            // 'groups' => 'usuario:read',
        ];

        // Serializa los usuarios con el contexto configurado
        $jsonUsuarios = $serializer->serialize($usuarios, 'json', $context);

        return new JsonResponse($jsonUsuarios, 200, [], true);
    }

    #[Route('/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, UsuarioRepository $userRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return new JsonResponse(['error' => 'Faltan datos'], 400);
        }

        $usuario = $userRepository->findOneBy(['email' => $email]);

        if (!$usuario) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        // Comparación directa de contraseña (NO recomendado para producción)
        if ($usuario->getPassword() !== $password) {
            return new JsonResponse(['error' => 'Contraseña incorrecta'], 401);
        }

        return new JsonResponse([
            'message' => 'Login exitoso',
            'usuario' => [
                'id' => $usuario->getId(),
                'email' => $usuario->getEmail(),
                'nombre' => $usuario->getNombre()
            ]
        ], 200);
    }


    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        UsuarioRepository $userRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $nombre = $data['nombre'] ?? null;
        $apellidos = $data['apellidos'] ?? null;
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;
        $telefono = $data['telefono'] ?? null;
        $dni = $data['dni'] ?? null;

        if (!$nombre || !$apellidos || !$email || !$password || !$telefono || !$dni) {
            return new JsonResponse(['error' => 'Faltan datos obligatorios'], 400);
        }

        // Verificar si el usuario ya existe
        if ($userRepository->findOneBy(['email' => $email])) {
            return new JsonResponse(['error' => 'Este email ya está registrado'], 409);
        }

        // Crear y guardar el usuario
        $usuario = new Usuario();
        $usuario->setNombre($nombre);
        $usuario->setApellidos($apellidos);
        $usuario->setEmail($email);
        $usuario->setPassword($password); // ¡OJO! sin hash
        $usuario->setTelefono($telefono);
        $usuario->setDni($dni);

        $entityManager->persist($usuario);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Usuario registrado con éxito',
            'usuario' => [
                'id' => $usuario->getId(),
                'email' => $usuario->getEmail(),
                'nombre' => $usuario->getNombre(),
                'apellidos' => $usuario->getApellidos()
            ]
        ], 201); // 201 Created
    }

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

    #[Route('/coche', name: 'coche_add', methods: ['POST'])]
    public function addCoche(
        Request $request,
        EntityManagerInterface $em,
        MarcaRepository $marcaRepository,
        ModeloRepository $modeloRepository,
        UsuarioRepository $usuarioRepository, // ⚠️ cámbialo por el usuario real autenticado si procede
        SluggerInterface $slugger
    ): JsonResponse {
        $marcaNombre = $request->get('marca');
        $modeloNombre = $request->get('modelo');
        $año = $request->get('año');
        
        /** @var UploadedFile|null $imagenFile */
        $imagenFile = $request->files->get('imagen');

        // Buscar marca y modelo
        $marca = $marcaRepository->findOneBy(['nombre' => $marcaNombre]);
        $modelo = $modeloRepository->findOneBy(['nombre' => $modeloNombre]);

        if (!$marca || !$modelo) {
            return new JsonResponse(['detail' => 'Marca o modelo no encontrado'], 400);
        }

        if (!$imagenFile) {
            return new JsonResponse(['detail' => 'No se recibió ninguna imagen'], 400);
        }

        // Crear entidad Coche
        $coche = new Coche();
        $coche->setMarca($marca);
        $coche->setModelo($modelo);
        
        $usuario = $usuarioRepository->find(6);

        if (!$usuario) {
            return new JsonResponse(['detail' => 'Usuario no encontrado'], 404);
        }
        
        $coche->setUsuario($usuario);
        $coche->setAño((int) $año);

        // Guardar imagen si existe
        if ($imagenFile) {
            $safeName = $slugger->slug(pathinfo($imagenFile->getClientOriginalName(), PATHINFO_FILENAME));
            $newFilename = $safeName.'-'.uniqid().'.'.$imagenFile->guessExtension();
        
            try {
                $imagenFile->move(
                    $this->getParameter('upload_directory_images'),
                    $newFilename
                );
                $coche->setImagen($newFilename); // ⬅️ ESTO FALTABA
            } catch (FileException $e) {
                return new JsonResponse(['detail' => 'Error al subir imagen'], 500);
            }
        }
        

        // Guardar en base de datos
        $em->persist($coche);
        $em->flush();

        return new JsonResponse([
            'detail' => 'Coche añadido correctamente'
        ], 200);
    }



    #[Route('/test-upload', name: 'test_upload', methods: ['POST'])]
    public function guardarImagen(
        Request $request,
        SluggerInterface $slugger
    ): JsonResponse {
        
        /** @var UploadedFile|null $imagenFile */
        $imagenFile = $request->files->get('imagen');

        if (!$imagenFile) {
            return new JsonResponse(['detail' => 'No se recibió ninguna imagen'], 400);
        }

        $safeName = $slugger->slug(pathinfo($imagenFile->getClientOriginalName(), PATHINFO_FILENAME));
        $newFilename = $safeName.'-'.uniqid().'.'.$imagenFile->guessExtension();

        try {
            $imagenFile->move(
                $this->getParameter('upload_directory_images'),
                $newFilename
            );
        } catch (FileException $e) {
            return new JsonResponse(['detail' => 'Error al subir imagen'], 500);
        }

        return new JsonResponse([
            'detail' => 'Imagen subida correctamente',
            'archivo' => $newFilename
        ]);
    }




}
