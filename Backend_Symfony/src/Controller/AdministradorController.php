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

        $numEmp = $data['numEmp'] ?? null;
        $password = $data['password'] ?? null;

        if (!$numEmp || !$password) {
            return $this->json(['detail' => 'Parámetros inválidos'], 400);
        }

        $admin = $repository->findOneBy(['NumEmp' => $numEmp]);

        if (!$admin || $admin->getPassword() !== $password) {
            return $this->json(['detail' => 'Credenciales incorrectas'], 401);
        }

        return $this->json([
            'id' => $admin->getId(),
            'numEmp' => $admin->getNumEmp(),
            'provincia' => [
                'id' => $admin->getTaller()?->getProvincia()?->getId(),
                'nombre' => $admin->getTaller()?->getProvincia()?->getNombre()
            ],
            'taller'=> $admin->getTaller()?->getId()
        ], 200);
    }
}
