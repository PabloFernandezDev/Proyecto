<?php

namespace App\DataFixtures;

use App\Entity\Marca;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class MarcaFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $marcas = [
            'Seat',
            'Volkswagen',
            'Peugeot',
            'Citroën',
            'Renault',
            'Opel',
            'Ford',
            'Toyota',
            'Kia',
            'Hyundai',
            'Nissan',
            'BMW',
            'Mercedes-Benz',
            'Audi',
            'Skoda',
            'Honda',
            'Fiat',
            'Mazda',
            'Dacia',
            'Jeep',
            'Lexus',
            'Volvo',
            'Tesla',
            'Cupra',
            'MG'
        ];

        foreach ($marcas as $nombreMarca) {
            $marca = new Marca();
            $marca->setNombre($nombreMarca);

            $manager->persist($marca);
            // Se añade la referencia para poder utilizarla en la fixture de modelos
            $this->addReference('marca-' . $nombreMarca, $marca);
        }

        $manager->flush();
    }
}
