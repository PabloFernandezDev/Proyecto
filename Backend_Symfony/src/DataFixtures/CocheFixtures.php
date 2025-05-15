<?php

namespace App\DataFixtures;

use App\Entity\Coche;
use App\Entity\Marca;
use App\Entity\Modelo;
use App\Entity\Taller;
use App\Entity\Usuario;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class CocheFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $provincias = ['Madrid', 'Sevilla', 'Barcelona', 'Valencia', 'Málaga'];

        $cochesData = [
            ['usuario_ref' => 'usuario_0', 'marca' => 'Seat', 'modelo' => 'Ibiza', 'provincia' => $provincias[0]],
            ['usuario_ref' => 'usuario_1', 'marca' => 'Volkswagen', 'modelo' => 'Golf', 'provincia' => $provincias[1]],
            ['usuario_ref' => 'usuario_2', 'marca' => 'Peugeot', 'modelo' => '208', 'provincia' => $provincias[2]],
            ['usuario_ref' => 'usuario_3', 'marca' => 'Citroën', 'modelo' => 'C3', 'provincia' => $provincias[3]],
            ['usuario_ref' => 'usuario_4', 'marca' => 'Renault', 'modelo' => 'Clio', 'provincia' => $provincias[4]],
        ];

        $matriculas = [
            '1234 BCD',
            '5678 FGH',
            '9101 JKL',
            '2345 MNP',
            '6789 RST'
        ];

        foreach ($cochesData as $key => $data) {
            $coche = new Coche();

            $usuario = $this->getReference($data['usuario_ref'], Usuario::class);
            $marca = $this->getReference('marca-' . $data['marca'], Marca::class);
            $modelo = $this->getReference('modelo-' . $data['marca'] . '-' . $data['modelo'], Modelo::class);
            $taller = $this->getReference('taller-' . $data['provincia'], Taller::class);

            $coche->setUsuario($usuario);
            $coche->setMarca($marca);
            $coche->setModelo($modelo);
            $coche->setMatricula($matriculas[$key]);
            $coche->setImagen('fondo-681dc5730d0fc.png');
            $coche->setTaller($taller);

            $manager->persist($coche);
            $this->addReference('coche_' . $key, $coche);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UsuarioFixtures::class,
            MarcaFixtures::class,
            ModeloFixtures::class,
            TallerFixtures::class,
        ];
    }
}
