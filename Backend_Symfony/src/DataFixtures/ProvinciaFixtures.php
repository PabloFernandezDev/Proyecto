<?php

namespace App\DataFixtures;

use App\Entity\Provincia;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ProvinciaFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $provincias = [
            'A Coruña',
            'Álava',
            'Albacete',
            'Alicante',
            'Almería',
            'Asturias',
            'Ávila',
            'Badajoz',
            'Barcelona',
            'Burgos',
            'Cáceres',
            'Cádiz',
            'Cantabria',
            'Castellón',
            'Ciudad Real',
            'Córdoba',
            'Cuenca',
            'Girona',
            'Granada',
            'Guadalajara',
            'Guipúzcoa',
            'Huelva',
            'Huesca',
            'Islas Baleares',
            'Jaén',
            'La Rioja',
            'Las Palmas',
            'León',
            'Lleida',
            'Lugo',
            'Madrid',
            'Málaga',
            'Murcia',
            'Navarra',
            'Ourense',
            'Palencia',
            'Pontevedra',
            'Salamanca',
            'Santa Cruz de Tenerife',
            'Segovia',
            'Sevilla',
            'Soria',
            'Tarragona',
            'Teruel',
            'Toledo',
            'Valencia',
            'Valladolid',
            'Vizcaya',
            'Zamora',
            'Zaragoza'
        ];

        foreach ($provincias as $nombre) {
            $provincia = new Provincia();
            $provincia->setNombre($nombre);
            $manager->persist($provincia);

            $this->addReference('Provincia-'.$nombre, $provincia);
        }

        $manager->flush();
    }
}
