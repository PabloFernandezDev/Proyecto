<?php

namespace App\DataFixtures;

use App\Entity\Coche;
use App\Entity\Mecanico;
use App\Entity\Reparaciones;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class ReparacionesFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $estados = ['Sin Empezar', 'Finalizado'];

        $posiblesTareas = [
            'Cambiar aceite',
            'Revisar frenos',
            'Sustituir neumáticos',
            'Alineación de dirección',
            'Cambio de batería',
            'Revisión de motor',
            'Sustituir bujías',
            'Cambio de filtros',
            'Revisar suspensión',
            'Ajustar luces',
        ];

        $mecanicoRefs = [];

        for ($i = 0; $i < 16; $i++) {
            for ($j = 0; $j < 3; $j++) {
                $ref = "mecanico_{$i}_{$j}";
                if ($this->hasReference($ref, Mecanico::class)) {
                    $mecanicoRefs[] = $ref;
                }
            }
        }

        for ($i = 0; $i < 5; $i++) {
            $reparacionesPorCoche = rand(1, 3);

            for ($j = 0; $j < $reparacionesPorCoche; $j++) {
                $reparacion = new Reparaciones();

                $estado = $estados[array_rand($estados)];
                $reparacion->setEstado($estado);
                $reparacion->setCoche($this->getReference('coche_' . $i, Coche::class));

                $mecanicoRef = $mecanicoRefs[array_rand($mecanicoRefs)];
                $reparacion->setMecanico($this->getReference($mecanicoRef, Mecanico::class));

                $reparacion->setFechaInicio(new \DateTime());

                shuffle($posiblesTareas);
                $descripcion = implode(', ', array_slice($posiblesTareas, 0, rand(1, 4)));
                $reparacion->setDescripcion($descripcion);

                $manager->persist($reparacion);
            }
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            CocheFixtures::class,
            MecanicoFixtures::class,
        ];
    }
}
