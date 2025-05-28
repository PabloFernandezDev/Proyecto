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
            'Madrid',
            'Sevilla',
            'Barcelona',
            'Valencia',
            'Málaga',
            'A Coruña',
            'Zaragoza',
            'Guipúzcoa',
            'Córdoba',
            'Albacete',
            'León',
            'La Rioja',
            'Ciudad Real',
            'Islas Baleares',
            'Santa Cruz de Tenerife',
            'Las Palmas'
        ];

        $nombres = [
            'Carlos',
            'Lucía',
            'Javier',
            'María',
            'David',
            'Sara',
            'Álvaro',
            'Carmen',
            'Raúl',
            'Laura',
            'Rubén',
            'Paula',
            'Hugo',
            'Elena',
            'Manuel',
            'Ana'
        ];

        $apellidos = [
            'Gómez Fernández',
            'Martínez Ruiz',
            'Sánchez López',
            'Pérez García',
            'Hernández Torres',
            'López Díaz',
            'García Romero',
            'Jiménez Ortega',
            'Ruiz Delgado',
            'Moreno Castillo',
            'Torres Sánchez',
            'Domínguez Ramos',
            'Vázquez Muñoz',
            'Navarro Molina',
            'Cano Herrera',
            'Delgado Cruz'
        ];

        foreach ($provincias as $index => $provincia) {
            $taller = $this->getReference('taller-' . $provincia, Taller::class);

            $admin = new Administrador();
            $admin->setNombre($nombres[$index]);
            $admin->setApellidos($apellidos[$index]);
            $admin->setNumEmp(1000 + $index);
            $admin->setTaller($taller);
            $admin->setPassword(password_hash('1234', PASSWORD_DEFAULT));
            $admin->setRol('ADMIN');

            $manager->persist($admin);
            $this->addReference('admin-' . $index, $admin);
        }

        $admin = new Administrador();
        $admin->setNombre('Super Administrador');
        $admin->setApellidos('Jefe');
        $admin->setNumEmp(9999);
        $admin->setTaller(null);
        $admin->setPassword(password_hash('1234', PASSWORD_DEFAULT));
        $admin->setRol('SUPER_ADMIN');
        $manager->persist($admin);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            TallerFixtures::class,
        ];
    }
}
