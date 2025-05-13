<?php

namespace App\Entity;

use App\Repository\FacturaRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FacturaRepository::class)]
class Factura
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['factura:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Groups(['factura:read'])]
    private ?string $numero = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['factura:read'])]
    private ?\DateTimeInterface $fechaEmision = null;

    #[ORM\Column(type: 'float')]
    #[Groups(['factura:read'])]
    private ?float $subtotal = null;

    #[ORM\Column(type: 'float')]
    #[Groups(['factura:read'])]
    private ?float $iva = null;

    #[ORM\Column(type: 'float')]
    #[Groups(['factura:read'])]
    private ?float $total = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['factura:read'])]
    private ?Reparaciones $reparacion = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['factura:read'])]
    private ?string $observaciones = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNumero(): ?string
    {
        return $this->numero;
    }

    public function setNumero(string $numero): static
    {
        $this->numero = $numero;

        return $this;
    }

    public function getFechaEmision(): ?\DateTimeInterface
    {
        return $this->fechaEmision;
    }

    public function setFechaEmision(\DateTimeInterface $fechaEmision): static
    {
        $this->fechaEmision = $fechaEmision;

        return $this;
    }

    public function getSubtotal(): ?float
    {
        return $this->subtotal;
    }

    public function setSubtotal(float $subtotal): static
    {
        $this->subtotal = $subtotal;

        return $this;
    }

    public function getIva(): ?float
    {
        return $this->iva;
    }

    public function setIva(float $iva): static
    {
        $this->iva = $iva;

        return $this;
    }

    public function getTotal(): ?float
    {
        return $this->total;
    }

    public function setTotal(float $total): static
    {
        $this->total = $total;

        return $this;
    }

    public function getReparacion(): ?Reparaciones
    {
        return $this->reparacion;
    }

    public function setReparacion(?Reparaciones $reparacion): static
    {
        $this->reparacion = $reparacion;

        return $this;
    }

    public function getObservaciones(): ?string
    {
        return $this->observaciones;
    }

    public function setObservaciones(?string $observaciones): static
    {
        $this->observaciones = $observaciones;

        return $this;
    }
}
