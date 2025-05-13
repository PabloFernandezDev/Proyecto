<?php

namespace App\Entity;

use App\Repository\ReparacionesRepository;
use Doctrine\DBAL\Types\Types;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ReparacionesRepository::class)]
class Reparaciones
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 200)]
    #[Groups(['coche:read', 'coches:read'])]

    private ?string $estado = null;

    #[ORM\ManyToOne(inversedBy: 'reparaciones')]
    #[Groups(['coches:read'])]
    private ?Mecanico $mecanico = null;

    #[ORM\ManyToOne(inversedBy: 'reparaciones')]
    private ?Coche $coche = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
     #[Groups(['coches:read'])]
    private ?\DateTimeInterface $fechaInicio = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
     #[Groups(['coches:read'])]
    private ?\DateTimeInterface $fechaFin = null;


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

    public function getMecanico(): ?Mecanico
    {
        return $this->mecanico;
    }

    public function setMecanico(?Mecanico $mecanico): static
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

    public function getFechaInicio(): ?\DateTimeInterface
    {
        return $this->fechaInicio;
    }

    public function setFechaInicio(\DateTimeInterface $fechaInicio): static
    {
        $this->fechaInicio = $fechaInicio;

        return $this;
    }

    public function getFechaFin(): ?\DateTimeInterface
    {
        return $this->fechaFin;
    }

    public function setFechaFin(\DateTimeInterface $fechaFin): static
    {
        $this->fechaFin = $fechaFin;

        return $this;
    }



}
