<?php

namespace App\Entity;

use App\Repository\NotificacionRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: NotificacionRepository::class)]
class Notificacion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['notificacion:read'])]

    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'notificaciones', targetEntity: Usuario::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $Usuario = null;

    #[ORM\Column(length: 255)]
    #[Groups(['notificacion:read'])]
    private ?string $mensaje = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['notificacion:read'])]
    private ?\DateTime $fecha = null;

    #[ORM\Column]
    #[Groups(['notificacion:read'])]
    private ?bool $leido = null;

    #[ORM\Column(length: 255)]
    #[Groups(['notificacion:read'])]
    private ?string $tipo = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsuario(): ?Usuario
    {
        return $this->Usuario;
    }

    public function setUsuario(?Usuario $Usuario): static
    {
        $this->Usuario = $Usuario;

        return $this;
    }

    public function getMensaje(): ?string
    {
        return $this->mensaje;
    }

    public function setMensaje(string $mensaje): static
    {
        $this->mensaje = $mensaje;

        return $this;
    }

    public function getFecha(): ?\DateTime
    {
        return $this->fecha;
    }

    public function setFecha(\DateTime $fecha): static
    {
        $this->fecha = $fecha;

        return $this;
    }

    public function isLeido(): ?bool
    {
        return $this->leido;
    }

    public function setLeido(bool $leido): static
    {
        $this->leido = $leido;

        return $this;
    }

    public function getTipo(): ?string
    {
        return $this->tipo;
    }

    public function setTipo(string $tipo): static
    {
        $this->tipo = $tipo;

        return $this;
    }
}
