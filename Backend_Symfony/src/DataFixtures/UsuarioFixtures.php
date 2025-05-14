<?php

namespace App\DataFixtures;

use App\Entity\Usuario;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class UsuarioFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $usuariosData = [
            [
                'nombre'    => 'Juan',
                'apellidos' => 'Pérez García',
                'email'     => 'juan.perez@example.com',
                'password'  => '1234',
                'telefono'  => '600111222',
                'dni'       => '12345678A'
            ],
            [
                'nombre'    => 'María',
                'apellidos' => 'López Sánchez',
                'email'     => 'maria.lopez@example.com',
                'password'  => '1234',
                'telefono'  => '600333444',
                'dni'       => '23456789B'
            ],
            [
                'nombre'    => 'Carlos',
                'apellidos' => 'Gómez Fernández',
                'email'     => 'carlos.gomez@example.com',
                'password'  => '1234',
                'telefono'  => '600555666',
                'dni'       => '34567890C'
            ],
            [
                'nombre'    => 'Ana',
                'apellidos' => 'Martínez Ruiz',
                'email'     => 'ana.martinez@example.com',
                'password'  => '1234',
                'telefono'  => '600777888',
                'dni'       => '45678901D'
            ],
            [
                'nombre'    => 'Luis',
                'apellidos' => 'Hernández López',
                'email'     => 'luis.hernandez@example.com',
                'password'  => '1234',
                'telefono'  => '600999000',
                'dni'       => '56789012E'
            ]
        ];

        foreach ($usuariosData as $key => $data) {
            $usuario = new Usuario();
            $usuario->setNombre($data['nombre'])
                    ->setApellidos($data['apellidos'])
                    ->setEmail($data['email'])
                    ->setPassword(password_hash($data['password'], PASSWORD_DEFAULT))
                    ->setTelefono($data['telefono'])
                    ->setDni($data['dni']);

            $manager->persist($usuario);
            $this->addReference('usuario_' . $key, $usuario);
        }

        $manager->flush();
    }
}
