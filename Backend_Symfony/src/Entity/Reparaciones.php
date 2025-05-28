<?php

namespace App\Entity;

use App\Repository\ReparacionesRepository;
use Doctrine\DBAL\Types\Types;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\JoinColumn;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity(repositoryClass: ReparacionesRepository::class)]
class Reparaciones
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['coches:read', 'mecanico:read'])]

    private ?int $id = null;

    #[ORM\Column(length: 200)]
    #[Groups(['coche:read', 'coches:read', 'mecanico:read'])]

    private ?string $estado = null;

    #[ORM\ManyToOne(inversedBy: 'reparaciones')]
    #[Groups(['mecanico:read'])]
    private ?Mecanico $mecanico = null;


    #[ORM\ManyToOne(inversedBy: 'reparaciones')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[MaxDepth(1)]
    #[Groups(['mecanico:read'])]
    private ?Coche $coche = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['coches:read', 'mecanico:read'])]
    private ?\DateTimeInterface $fechaInicio = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['coches:read', 'mecanico:read'])]
    private ?\DateTimeInterface $fechaFin = null;

    #[ORM\Column(length: 255)]
    private ?string $descripcion = null;

    #[ORM\Column(type: 'float', nullable: true)]
    private $precio;

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

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(string $descripcion): static
    {
        $this->descripcion = $descripcion;

        return $this;
    }


    public function getPrecio(): ?float
    {
        return $this->precio;
    }

    public function setPrecio(float $precio): self
    {
        $this->precio = $precio;
        return $this;
    }

}
