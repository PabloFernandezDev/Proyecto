<?php

namespace App\DataFixtures;

use App\Entity\Marca;
use App\Entity\Modelo;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class ModeloFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Array asociativo: Marca => [Modelos]
        $marcasConModelos = [
            'Seat' => ['Ibiza', 'León', 'Ateca', 'Arona', 'Tarraco', 'Toledo', 'Alhambra', 'Mii'],
            'Volkswagen' => ['Golf', 'Polo', 'Passat', 'Tiguan', 'T-Roc', 'Touran', 'Arteon'],
            'Peugeot' => ['208', '308', '3008', '508', '2008', '5008', 'Rifter'],
            'Citroën' => ['C1', 'C3', 'C4', 'C5 Aircross', 'Berlingo'],
            'Renault' => ['Clio', 'Mégane', 'Twingo', 'Captur', 'Kadjar', 'Scénic', 'Zoe'],
            'Opel' => ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Crossland', 'Grandland'],
            'Ford' => ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'Puma', 'S-Max'],
            'Toyota' => ['Yaris', 'Corolla', 'C-HR', 'RAV4', 'Auris', 'Prius', 'Avensis'],
            'Kia' => ['Picanto', 'Rio', 'Ceed', 'Sportage', 'Stonic', 'Sorento'],
            'Hyundai' => ['i10', 'i20', 'i30', 'Tucson', 'Kona', 'Santa Fe'],
            'Nissan' => ['Micra', 'Juke', 'Qashqai', 'X-Trail', 'Leaf'],
            'BMW' => ['Serie 1', 'Serie 2', 'Serie 3', 'Serie 5', 'Serie 7', 'X1', 'X3', 'X5', 'i3', 'iX'],
            'Mercedes-Benz' => ['Clase A', 'Clase B', 'Clase C', 'Clase E', 'Clase S', 'GLA', 'GLC', 'GLE'],
            'Audi' => ['A1', 'A3', 'A4', 'A6', 'Q2', 'Q3', 'Q5', 'Q7'],
            'Skoda' => ['Fabia', 'Octavia', 'Superb', 'Karoq', 'Kodiaq'],
            'Honda' => ['Jazz', 'Civic', 'Accord', 'CR-V', 'HR-V'],
            'Fiat' => ['500', 'Panda', 'Tipo', '500X', '500L', 'Doblo'],
            'Mazda' => ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-5'],
            'Dacia' => ['Sandero', 'Logan', 'Duster', 'Lodgy', 'Spring'],
            'Jeep' => ['Wrangler', 'Renegade', 'Compass', 'Cherokee', 'Grand Cherokee'],
            'Lexus' => ['CT', 'IS', 'ES', 'NX', 'RX', 'UX'],
            'Volvo' => ['XC40', 'XC60', 'XC90', 'S60', 'S90', 'V60', 'V90'],
            'Tesla' => ['Model 3', 'Model S', 'Model X', 'Model Y'],
            'Cupra' => ['Formentor', 'Leon', 'Ateca', 'Born'],
            'MG' => ['MG ZS', 'MG HS', 'MG EHS', 'MG5']
        ];

        foreach ($marcasConModelos as $nombreMarca => $modelos) {
            // Recuperamos la marca usando la referencia establecida en MarcaFixtures
            $marca = $this->getReference('marca-' . $nombreMarca, Marca::class);
            
            foreach ($modelos as $nombreModelo) {
                $modelo = new Modelo();
                $modelo->setNombre($nombreModelo);
                // Asigna la marca al modelo
                $modelo->setMarca($marca);
                $manager->persist($modelo);
                
                // Opcional: establecer una referencia única para el modelo (puedes concatenar la marca para evitar duplicados)
                $this->addReference('modelo-' . $nombreMarca . '-' . $nombreModelo, $modelo);
            }
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            // Se necesita que MarcaFixtures se cargue primero
            MarcaFixtures::class,
        ];
    }
}
