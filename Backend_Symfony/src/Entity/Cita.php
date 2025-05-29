<?php

namespace App\Entity;

use App\Repository\CitaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CitaRepository::class)]
class Cita
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['cita:read', 'factura:read'])]

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

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups(['factura:read', 'cita:read'])]
    private bool $consentimientoAceptado = false;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $fechaConsentimiento = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $presupuestoPdf = null;

    /**
     * @var Collection<int, Factura>
     */
    #[ORM\OneToMany(targetEntity: Factura::class, mappedBy: 'cita')]
    #[Groups(['cita:read'])]
    private Collection $facturas;

    public function __construct()
    {
        $this->facturas = new ArrayCollection();
    }

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
    public function isConsentimientoAceptado(): bool
    {
        return $this->consentimientoAceptado;
    }

    public function setConsentimientoAceptado(bool $consentimientoAceptado): self
    {
        $this->consentimientoAceptado = $consentimientoAceptado;
        return $this;
    }

    public function getFechaConsentimiento(): ?\DateTimeInterface
    {
        return $this->fechaConsentimiento;
    }

    public function setFechaConsentimiento(?\DateTimeInterface $fechaConsentimiento): self
    {
        $this->fechaConsentimiento = $fechaConsentimiento;
        return $this;
    }

    public function getPresupuestoPdf(): ?string
    {
        return $this->presupuestoPdf;
    }

    public function setPresupuestoPdf(?string $presupuestoPdf): self
    {
        $this->presupuestoPdf = $presupuestoPdf;
        return $this;
    }

    /**
     * @return Collection<int, Factura>
     */
    public function getFacturas(): Collection
    {
        return $this->facturas;
    }

    public function addFactura(Factura $factura): static
    {
        if (!$this->facturas->contains($factura)) {
            $this->facturas->add($factura);
            $factura->setCita($this);
        }

        return $this;
    }

    public function removeFactura(Factura $factura): static
    {
        if ($this->facturas->removeElement($factura)) {
            // set the owning side to null (unless already changed)
            if ($factura->getCita() === $this) {
                $factura->setCita(null);
            }
        }

        return $this;
    }
}
