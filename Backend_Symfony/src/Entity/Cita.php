<?php

namespace App\Entity;

use App\Repository\CitaRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CitaRepository::class)]
class Cita
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['cita:read'])]

    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'citas')]
    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[Groups(['cita:read'])]
    private ?Usuario $usuario = null;

    #[ORM\ManyToOne(inversedBy: 'citas')]
    private ?Provincia $provincia = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['cita:read'])]
    private ?\DateTimeInterface $fecha = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    #[Groups(['cita:read'])]
    private ?\DateTimeInterface $hora = null;

    #[ORM\Column(length: 255)]
    #[Groups(['cita:read'])]
    private ?string $motivo = null;

    #[ORM\Column(length: 255)]
    #[Groups(['cita:read'])]
    private ?string $estado = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsuario(): ?Usuario
    {
        return $this->usuario;
    }

    public function setUsuario(?Usuario $usuario): static
    {
        $this->usuario = $usuario;

        return $this;
    }

    public function getProvincia(): ?Provincia
    {
        return $this->provincia;
    }

    public function setProvincia(?Provincia $provincia): static
    {
        $this->provincia = $provincia;

        return $this;
    }

    public function getFecha(): ?\DateTimeInterface
    {
        return $this->fecha;
    }

    public function setFecha(\DateTimeInterface $fecha): static
    {
        $this->fecha = $fecha;

        return $this;
    }

    public function getHora(): ?\DateTimeInterface
    {
        return $this->hora;
    }

    public function setHora(\DateTimeInterface $hora): static
    {
        $this->hora = $hora;

        return $this;
    }

    public function getMotivo(): ?string
    {
        return $this->motivo;
    }

    public function setMotivo(string $motivo): static
    {
        $this->motivo = $motivo;

        return $this;
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
}
