<?php

namespace App\DataFixtures;

use App\Entity\Taller;
use App\Entity\Provincia;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class TallerFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $datosTalleres = [
            ['direccion' => 'Calle Alcalá 123', 'latitud' => 40.421, 'longitud' => -3.682, 'provincia' => 'Madrid'],
            ['direccion' => 'Avenida de Andalucía 45', 'latitud' => 37.391, 'longitud' => -5.984, 'provincia' => 'Sevilla'],
            ['direccion' => 'Gran Vía 78', 'latitud' => 41.388, 'longitud' => 2.165, 'provincia' => 'Barcelona'],
            ['direccion' => 'Calle Mayor 22', 'latitud' => 39.469, 'longitud' => -0.376, 'provincia' => 'Valencia'],
            ['direccion' => 'Ronda de Poniente 5', 'latitud' => 36.721, 'longitud' => -4.421, 'provincia' => 'Málaga'],
            ['direccion' => 'Calle Real 10', 'latitud' => 43.362, 'longitud' => -8.411, 'provincia' => 'A Coruña'],
            ['direccion' => 'Paseo Independencia 100', 'latitud' => 41.649, 'longitud' => -0.887, 'provincia' => 'Zaragoza'],
            ['direccion' => 'Avda. Libertad 13', 'latitud' => 43.321, 'longitud' => -1.985, 'provincia' => 'Guipúzcoa'],
            ['direccion' => 'Calle San Fernando 6', 'latitud' => 37.889, 'longitud' => -4.779, 'provincia' => 'Córdoba'],
            ['direccion' => 'Avda. Juan Carlos I 9', 'latitud' => 38.995, 'longitud' => -1.856, 'provincia' => 'Albacete'],
            ['direccion' => 'Calle de la Rúa 27', 'latitud' => 42.598, 'longitud' => -5.567, 'provincia' => 'León'],
            ['direccion' => 'Calle Laurel 15', 'latitud' => 42.466, 'longitud' => -2.449, 'provincia' => 'La Rioja'],
            ['direccion' => 'Avda. del Puerto 8', 'latitud' => 38.984, 'longitud' => -3.927, 'provincia' => 'Ciudad Real'],
            ['direccion' => 'Calle Marina 3', 'latitud' => 39.569, 'longitud' => 2.650, 'provincia' => 'Islas Baleares'],
            ['direccion' => 'Calle Castillo 12', 'latitud' => 28.469, 'longitud' => -16.254, 'provincia' => 'Santa Cruz de Tenerife'],
            ['direccion' => 'Calle León y Castillo 23', 'latitud' => 28.123, 'longitud' => -15.431, 'provincia' => 'Las Palmas'],
        ];

        foreach ($datosTalleres as $datos) {
            $provincia = $this->getReference('Provincia-'.$datos['provincia'], Provincia::class);

            $taller = new Taller();
            $taller->setProvincia($provincia);
            $taller->setDireccion($datos['direccion']);
            $taller->setLatitud($datos['latitud']);
            $taller->setLongitud($datos['longitud']);

            $manager->persist($taller);

            $this->addReference('taller-'.$datos['provincia'], $taller);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            ProvinciaFixtures::class,
        ];
    }
}
