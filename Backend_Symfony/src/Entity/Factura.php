<?php

namespace App\Entity;

use App\Repository\FacturaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: FacturaRepository::class)]
class Factura
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['factura:read','coche:read', 'facturas:read'])]  

    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Groups(['factura:read', 'facturas:read'])]
    private ?string $numero = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['factura:read', 'facturas:read'])]
    private ?\DateTimeInterface $fechaEmision = null;

    #[ORM\Column(type: 'float')]
    #[Groups(['factura:read', 'facturas:read'])]
    private ?float $subtotal = null;

    #[ORM\Column(type: 'float')]
    #[Groups(['factura:read', 'facturas:read'])]
    private ?float $iva = null;

    #[ORM\Column(type: 'float')]
    #[Groups(['factura:read', 'facturas:read'])]
    private ?float $total = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['factura:read', 'facturas:read'])]
    private ?string $observaciones = null;

    #[ORM\ManyToOne(inversedBy: 'facturas')]
    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[Groups(['factura:read'])]
    private ?Usuario $usuario = null;

    #[ORM\OneToMany(mappedBy: 'factura', targetEntity: LineaFactura::class, cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups(['factura:read'])]
    private Collection $lineaFactura;

    #[ORM\Column(length: 255)]
    #[Groups(['factura:read'])]
    private ?string $metodoPago = null;

    public function __construct()
    {
        $this->lineaFactura = new ArrayCollection();
    }

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


    public function getObservaciones(): ?string
    {
        return $this->observaciones;
    }

    public function setObservaciones(?string $observaciones): static
    {
        $this->observaciones = $observaciones;

        return $this;
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

    /**
     * @return Collection<int, LineaFactura>
     */
    public function getLineaFactura(): Collection
    {
        return $this->lineaFactura;
    }

    public function addLineaFactura(LineaFactura $lineaFactura): static
    {
        if (!$this->lineaFactura->contains($lineaFactura)) {
            $this->lineaFactura->add($lineaFactura);
            $lineaFactura->setFactura($this); // 👈 Relación inversa
        }

        return $this;
    }

    public function removeLineaFactura(LineaFactura $lineaFactura): static
    {
        if ($this->lineaFactura->removeElement($lineaFactura)) {
            if ($lineaFactura->getFactura() === $this) {
                $lineaFactura->setFactura(null);
            }
        }

        return $this;
    }

    public function getMetodoPago(): ?string
    {
        return $this->metodoPago;
    }

    public function setMetodoPago(string $metodoPago): static
    {
        $this->metodoPago = $metodoPago;

        return $this;
    }
}
