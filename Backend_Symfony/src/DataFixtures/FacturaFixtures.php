<?php

namespace App\DataFixtures;

use App\Entity\Factura;
use App\Entity\LineaFactura;
use App\DataFixtures\UsuarioFixtures;
use App\Entity\Usuario;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class FacturaFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        $usuarios = [];
        for ($i = 0; $i < 5; $i++) {
            $usuarios[] = $this->getReference('usuario_' . $i, Usuario::class);
        }

        for ($i = 0; $i < 10; $i++) {
            $factura = new Factura();

            $subtotal = $faker->randomFloat(2, 50, 500);
            $iva = $subtotal * 0.21;
            $total = $subtotal + $iva;

            $factura->setNumero((string) $faker->unique()->numberBetween(1000, 9999));
            $factura->setFechaEmision($faker->dateTimeBetween('-1 years', 'now'));
            $factura->setSubtotal($subtotal);
            $factura->setIva($iva);
            $factura->setTotal($total);
            $factura->setMetodoPago('Tarjeta');
            $factura->setObservaciones($faker->boolean(30) ? $faker->sentence() : null);
            $factura->setUsuario($faker->randomElement($usuarios));

            $numLineas = rand(1, 3);
            for ($j = 0; $j < $numLineas; $j++) {
                $linea = new LineaFactura();
                $precio = $faker->randomFloat(2, 10, 100);
                $cantidad = rand(1, 5);
                $linea->setConcepto($faker->word());
                $linea->setDescripcion($faker->sentence());
                $linea->setPrecio($precio);
                $linea->setCantidad($cantidad);
                $linea->setTotal($precio * $cantidad);
                $linea->setFactura($factura);

                $manager->persist($linea);
                $factura->addLineaFactura($linea);
            }

            $manager->persist($factura);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UsuarioFixtures::class
        ];
    }
}
