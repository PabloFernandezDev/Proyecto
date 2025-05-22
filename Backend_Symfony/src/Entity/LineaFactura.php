<?php

namespace App\Entity;

use App\Repository\LineaFacturaRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: LineaFacturaRepository::class)]
class LineaFactura
{
   #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['factura:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['factura:read'])]
    private ?string $concepto = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['factura:read'])]
    private ?string $descripcion = null;

    #[ORM\Column]
    #[Groups(['factura:read'])]
    private ?float $precio = null;

    #[ORM\Column]
    #[Groups(['factura:read'])]
    private ?int $cantidad = null;

    #[ORM\Column]
    #[Groups(['factura:read'])]
    private ?float $total = null;

    #[ORM\ManyToOne(inversedBy: 'lineaFactura')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Factura $factura = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getConcepto(): ?string
    {
        return $this->concepto;
    }

    public function setConcepto(string $concepto): static
    {
        $this->concepto = $concepto;

        return $this;
    }

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(?string $descripcion): static
    {
        $this->descripcion = $descripcion;

        return $this;
    }

    public function getPrecio(): ?float
    {
        return $this->precio;
    }

    public function setPrecio(float $precio): static
    {
        $this->precio = $precio;

        return $this;
    }

    public function getCantidad(): ?int
    {
        return $this->cantidad;
    }

    public function setCantidad(int $cantidad): static
    {
        $this->cantidad = $cantidad;

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


    public function getFactura(): ?Factura
    {
        return $this->factura;
    }

    public function setFactura(?Factura $factura): static
    {
        $this->factura = $factura;

        return $this;
    }

}
