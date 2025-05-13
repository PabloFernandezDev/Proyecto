<?php

namespace App\DataFixtures;

use App\Entity\Coche;
use App\Entity\Marca;
use App\Entity\Usuario;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class CocheFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Array de datos para crear coches y asignarles un usuario
        $cochesData = [
            ['usuario_ref' => 'usuario_0'],
            ['usuario_ref' => 'usuario_1'],
            ['usuario_ref' => 'usuario_2'],
            ['usuario_ref' => 'usuario_3'],
            ['usuario_ref' => 'usuario_4'],
            // Puedes agregar más coches si lo deseas
        ];

        // Array de nombres de marca a usar (estos deben coincidir con los definidos en MarcaFixtures)
        $marcas = [
            'Seat',
            'Volkswagen',
            'Peugeot',
            'Citroën',
            'Renault'
        ];

        foreach ($cochesData as $key => $data) {
            $coche = new Coche();

            // Recuperamos el usuario asignado a este coche mediante la referencia
            $usuario = $this->getReference($data['usuario_ref'], Usuario::class);
            $coche->setUsuario($usuario);

            // Asignamos una marca al coche utilizando las referencias definidas en MarcaFixtures
            // Se asigna de manera cíclica utilizando el índice del coche
            $marcaNombre = $marcas[$key % count($marcas)];
            $marca = $this->getReference('marca-' . $marcaNombre, Marca::class);
            $coche->setMarca($marca);
            $coche->setMatricula('123abc');
            $coche->setImagen('fondo-681dc5730d0fc.png');
            $manager->persist($coche);
            $this->addReference('coche_' . $key, $coche);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UsuarioFixtures::class,
        ];
    }
}
