<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/')]
final class SuperAdminController extends AbstractController
{
    #[Route('/super/admin', name: 'app_super_admin')]
    public function index(): Response
    {
        return $this->render('super_admin/index.html.twig', [
            'controller_name' => 'SuperAdminController',
        ]);
    }
}
