<?php

namespace App\DataFixtures;

use App\Entity\LineaFactura;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class LineaFacturaFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $conceptos = [
            ['Cambio de aceite', 'Aceite sintético 5W-30'],
            ['Revisión general', 'Inspección de frenos, filtros y luces'],
            ['Cambio de neumáticos', 'Neumáticos de verano 195/65 R15'],
            ['Sustitución de batería', 'Batería 12V 60Ah'],
            ['Alineación de dirección', 'Ajuste de geometría'],
            ['Cambio de pastillas de freno', 'Pastillas delanteras Bosch'],
            ['Sustitución de amortiguadores', 'Amortiguadores delanteros Monroe'],
            ['Diagnóstico electrónico', 'Lectura de errores OBD2'],
            ['Recarga de aire acondicionado', 'Gas refrigerante R134a'],
            ['Cambio de correa de distribución', 'Kit completo con bomba de agua'],
            ['Lavado completo', 'Interior + exterior'],
            ['Sustitución de luces', 'Bombillas H7 Philips'],
            ['Limpieza de inyectores', 'Tratamiento con ultrasonidos'],
            ['Revisión de escape', 'Silencioso trasero'],
            ['Cambio filtro de habitáculo', 'Filtro con carbón activo']
        ];

        for ($i = 0; $i < 15; $i++) {
            $linea = new LineaFactura();
            $linea->setConcepto($conceptos[$i][0]);
            $linea->setDescripcion($conceptos[$i][1]);

            $precio = random_int(20, 200);
            $cantidad = random_int(1, 3);
            $total = $precio * $cantidad;

            $linea->setPrecio($precio);
            $linea->setCantidad($cantidad);
            $linea->setTotal($total);

            $manager->persist($linea);
            $this->addReference('linea_factura_' . $i, $linea);
        }

        $manager->flush();
    }
}
