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
        for ($i = 0; $i < 16; $i++) {
            $admin = $this->getReference('admin-'.$i, Administrador::class);

            $numMecanicos = ($i % 3 === 0) ? 3 : (($i % 2 === 0) ? 2 : 1);

            for ($j = 0; $j < $numMecanicos; $j++) {
                $mecanico = new Mecanico();
                $mecanico->setNombre("Mec_$i$j");
                $mecanico->setApellidos("Apellido_$i$j");
                $mecanico->setNumEmp(2000 + ($i * 10) + $j);
                $mecanico->setPassword('1234');
                $mecanico->setAdministrador($admin);

                $manager->persist($mecanico);
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
