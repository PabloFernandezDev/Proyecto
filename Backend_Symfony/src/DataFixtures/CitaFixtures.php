<?php

namespace App\DataFixtures;

use App\Entity\Cita;
use App\Entity\Usuario;
use App\Entity\Provincia;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class CitaFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('es_ES');

        for ($i = 0; $i < 10; $i++) {
            $cita = new Cita();
            $usuarioRef = $this->getReference('usuario_' . ($i % 5), Usuario::class); 
            $provinciaRef = $this->getReference('Provincia-Madrid', Provincia::class); 

            $cita->setUsuario($usuarioRef);
            $cita->setProvincia($provinciaRef);
            $cita->setFecha($faker->dateTimeBetween('+1 days', '+2 months'));
            $cita->setHora($faker->dateTimeBetween('09:00', '20:00'));
            $cita->setMotivo($faker->sentence(6));
            $cita->setEstado($faker->randomElement(['Pendiente', 'Confirmada', 'Cancelada']));

            $manager->persist($cita);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UsuarioFixtures::class,
            ProvinciaFixtures::class,
        ];
    }
}
