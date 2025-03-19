<?php

namespace App\Entity;

use App\Repository\ReparacionesRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ReparacionesRepository::class)]
class Reparaciones
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 200)]
    private ?string $estado = null;

    #[ORM\ManyToOne(inversedBy: 'reparaciones')]
    private ?mecanico $mecanico = null;

    #[ORM\ManyToOne(inversedBy: 'reparaciones')]
    private ?coche $coche = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEstado(): ?string
    {
        return $this->estado;
    }

    public function setEstado(string $estado): static
    {
        $this->estado = $estado;

        return $this;
    }

    public function getMecanico(): ?mecanico
    {
        return $this->mecanico;
    }

    public function setMecanico(?mecanico $mecanico): static
    {
        $this->mecanico = $mecanico;

        return $this;
    }

    public function getCoche(): ?coche
    {
        return $this->coche;
    }

    public function setCoche(?coche $coche): static
    {
        $this->coche = $coche;

        return $this;
    }
}
