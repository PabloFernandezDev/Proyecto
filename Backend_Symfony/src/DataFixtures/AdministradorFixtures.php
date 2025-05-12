<?php

namespace App\DataFixtures;

use App\Entity\Administrador;
use App\Entity\Taller;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class AdministradorFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $provincias = [
            'Madrid', 'Sevilla', 'Barcelona', 'Valencia', 'Málaga',
            'A Coruña', 'Zaragoza', 'Guipúzcoa', 'Córdoba', 'Albacete',
            'León', 'La Rioja', 'Ciudad Real', 'Islas Baleares',
            'Santa Cruz de Tenerife', 'Las Palmas'
        ];

        foreach ($provincias as $index => $provincia) {
            $taller = $this->getReference( 'taller-'.$provincia, Taller::class);

            $admin = new Administrador();
            $admin->setNombre("Admin $provincia" );
            $admin->setApellidos("Apellido $provincia");
            $admin->setNumEmp(1000 + $index);
            $admin->setTaller($taller);
            $admin->setPassword('1234'); // contraseña en texto plano

            $manager->persist($admin);

            $this->addReference('admin-'.$index , $admin);

        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            TallerFixtures::class,
        ];
    }
}
