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

        $cochesData = [
            ['usuario_ref' => 'usuario_0', 'marca' => 'Seat', 'modelo' => 'Ibiza', 'provincia' => 'Madrid'],
            ['usuario_ref' => 'usuario_1', 'marca' => 'Volkswagen', 'modelo' => 'Golf', 'provincia' => 'Madrid'],
            ['usuario_ref' => 'usuario_2', 'marca' => 'Peugeot', 'modelo' => '208', 'provincia' => 'Madrid'],
            ['usuario_ref' => 'usuario_3', 'marca' => 'Citroën', 'modelo' => 'C3', 'provincia' => 'Sevilla'],
            ['usuario_ref' => 'usuario_4', 'marca' => 'Renault', 'modelo' => 'Clio', 'provincia' => 'Barcelona'],
            ['usuario_ref' => 'usuario_5', 'marca' => 'Toyota', 'modelo' => 'Yaris', 'provincia' => 'Valencia'],
            ['usuario_ref' => 'usuario_6', 'marca' => 'Ford', 'modelo' => 'Focus', 'provincia' => 'Málaga'],
            ['usuario_ref' => 'usuario_7', 'marca' => 'Hyundai', 'modelo' => 'i20', 'provincia' => 'Madrid'],
            ['usuario_ref' => 'usuario_8', 'marca' => 'Kia', 'modelo' => 'Ceed', 'provincia' => 'Sevilla'],
            ['usuario_ref' => 'usuario_9', 'marca' => 'Nissan', 'modelo' => 'Micra', 'provincia' => 'Valencia'],
        ];

        $matriculas = [
            '1234 BCD', '5678 FGH', '9101 JKL', '2345 MNP', '6789 RST',
            '3456 TUV', '7890 XYZ', '1122 ABC', '3344 DEF', '5566 GHI'
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
            $coche->setAño(2020 + ($key % 4));
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
