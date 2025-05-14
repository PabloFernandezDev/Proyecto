<?php

namespace App\DataFixtures;

use App\Entity\Mecanico;
use App\Entity\Administrador;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class MecanicoFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $nombres = [
            'Iván', 'Raquel', 'Mario', 'Ainhoa', 'Sergio',
            'Noelia', 'Pablo', 'Irene', 'Alejandro', 'Natalia',
            'Joel', 'Claudia', 'Víctor', 'Beatriz', 'Daniela',
            'Adrián', 'Lara', 'Joaquín', 'Cristina', 'Gabriel',
            'Esther', 'Óscar', 'Alba', 'Diego', 'Eva',
            'Andrés', 'Marta', 'Guillermo', 'Patricia', 'Bruno',
            'Andrea', 'Héctor', 'Rosa', 'Ismael', 'Lorena'
        ];

        $apellidos = [
            'Silva Moreno', 'Campos Navarro', 'Crespo Iglesias', 'Ortega Bravo', 'Reyes Peña',
            'Mendoza Arias', 'Carrillo Pastor', 'Aguilar Caballero', 'Gallego Rubio', 'Camacho León',
            'Benítez Lozano', 'Salas Vera', 'Durán Montes', 'Herrera Vidal', 'Peña Cordero',
            'Santos Esteban', 'Del Valle Pons', 'Padilla Soler', 'Romero Valverde', 'Nieto Cuesta',
            'Fernández Cid', 'Del Río Gallardo', 'Correa Parra', 'Delgado Núñez', 'López Calvo',
            'Martín Rosales', 'Vega Llamas', 'Cano Bustamante', 'Soler Plaza', 'Marín Otero',
            'Quintero Serrano', 'Ibáñez Rivas', 'Garrido Cortés', 'Sánchez del Río', 'Lozano Varela'
        ];

        $nombreIndex = 0;

        for ($i = 0; $i < 16; $i++) {
            $admin = $this->getReference('admin-' . $i, Administrador::class);
            $numMecanicos = ($i % 3 === 0) ? 3 : (($i % 2 === 0) ? 2 : 1);

            for ($j = 0; $j < $numMecanicos; $j++) {
                $mecanico = new Mecanico();
                $mecanico->setNombre($nombres[$nombreIndex % count($nombres)]);
                $mecanico->setApellidos($apellidos[$nombreIndex % count($apellidos)]);
                $mecanico->setNumEmp(2000 + ($i * 10) + $j);
                $mecanico->setPassword(password_hash('1234', PASSWORD_DEFAULT));
                $mecanico->setAdministrador($admin);

                $manager->persist($mecanico);
                $this->addReference("mecanico_{$i}_{$j}", $mecanico);

                $nombreIndex++;
            }
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            AdministradorFixtures::class,
        ];
    }
}

