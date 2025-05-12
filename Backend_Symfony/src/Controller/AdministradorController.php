<?php

namespace App\Controller;

use App\Entity\Administrador;
use App\Entity\Mecanico;
use App\Repository\AdministradorRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/')]
final class AdministradorController extends AbstractController
{
    #[Route('/admin/login', name: 'login_admin', methods: ['POST'])]
    public function login(Request $request, AdministradorRepository $repository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $numEmp =  $data['numEmp'] ?? null;
        $password = $data['password'] ?? null;

        if (!$numEmp || !$password ) {
            return $this->json(['detail' => 'Parámetros inválidos'], 400);
        }

        $usuario = $repository->findOneBy(['NumEmp' => $numEmp]);

        if (!$usuario || $usuario->getPassword() !== $password) {
            return $this->json(['detail' => 'Credenciales incorrectas'], 401);
        }

        return $this->json([
            'id' => $usuario->getId(),
            'numEmp' => $usuario->getNumEmp()
        ], 200);
    }
}
