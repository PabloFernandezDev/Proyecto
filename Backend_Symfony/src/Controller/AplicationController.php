<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class AplicationController extends AbstractController
{
    #[Route('/aplication', name: 'app_aplication')]
    public function index(): Response
    {
        return $this->render('aplication/index.html.twig', [
            'controller_name' => 'AplicationController',
        ]);
    }
}
