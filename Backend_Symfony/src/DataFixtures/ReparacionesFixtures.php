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
        $estados = ['En revisión', 'En reparación', 'Finalizado', 'Urgente'];

        // Total mecánicos generados: 16 admins × hasta 3 mecánicos por admin = hasta 48
        $mecanicoRefs = [];

        // Preparamos todas las referencias de mecánicos que hayan sido generadas
        for ($i = 0; $i < 16; $i++) {
            for ($j = 0; $j < 3; $j++) {
                $ref = "mecanico_{$i}_{$j}";
                if ($this->hasReference($ref,Mecanico::class)) {
                    $mecanicoRefs[] = $ref;
                }
            }
        }

        for ($i = 0; $i < 5; $i++) {
            $reparacionesPorCoche = rand(1, 3);

            for ($j = 0; $j < $reparacionesPorCoche; $j++) {
                $reparacion = new Reparaciones();
                $reparacion->setEstado($estados[array_rand($estados)]);
                $reparacion->setCoche($this->getReference('coche_' . $i, Coche::class));

                // Asigna un mecánico aleatorio de los disponibles
                $mecanicoRef = $mecanicoRefs[array_rand($mecanicoRefs)];
                $reparacion->setMecanico($this->getReference($mecanicoRef, Mecanico::class));

                $reparacion->setFechaInicio(new \DateTime());
                $reparacion->setFechaFin(new \DateTime());

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
