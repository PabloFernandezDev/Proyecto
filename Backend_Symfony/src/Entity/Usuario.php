<?php

namespace App\Entity;

use App\Repository\UsuarioRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UsuarioRepository::class)]
class Usuario
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['usuario:read', 'coches:read', 'mecanico:read', 'cita:read', 'factura:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 200)]
    #[Groups(['usuario:read', 'coche:read', 'coches:read', 'mecanico:read', 'cita:read', 'factura:read'])]
    private ?string $nombre = null;

    #[ORM\Column(length: 200)]
    #[Groups(['usuario:read', 'coche:read', 'coches:read', 'mecanico:read', 'cita:read', 'factura:read'])]
    private ?string $apellidos = null;

    #[ORM\Column(length: 200)]
    #[Groups(['usuario:read', 'coche:read', 'coches:read', 'mecanico:read', 'cita:read', 'factura:read'])]
    private ?string $email = null;

    #[ORM\Column(length: 200)]
    #[Groups(['usuario:read'])]
    private ?string $password = null;

    #[ORM\Column(length: 200)]
    #[Groups(['usuario:read', 'coche:read', 'coches:read', 'cita:read', 'factura:read'])]

    private ?string $telefono = null;

    #[ORM\Column(length: 200)]
    #[Groups(['usuario:read', 'coche:read', 'mecanico:read', 'cita:read', 'factura:read'])]

    private ?string $dni = null;

    #[ORM\Column(type: 'boolean')]
    private bool $confirmado = false;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $tokenConfirmacion = null;
    /**
     * @var Collection<int, Coche>
     */
    #[ORM\OneToMany(targetEntity: Coche::class, mappedBy: 'usuario')]
    #[Groups(['cita:read'])]
    private Collection $coches;

    /**
     * @var Collection<int, Cita>
     */
    #[ORM\OneToMany(targetEntity: Cita::class, mappedBy: 'usuario')]
    private Collection $citas;

    /**
     * @var Collection<int, Factura>
     */
    #[ORM\OneToMany(targetEntity: Factura::class, mappedBy: 'usuario')]
    #[Groups(['coche:read', 'facturas:read'])]
    private Collection $facturas;


    public function __construct()
    {
        $this->coches = new ArrayCollection();
        $this->citas = new ArrayCollection();
        $this->facturas = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): static
    {
        $this->nombre = $nombre;

        return $this;
    }

    public function getApellidos(): ?string
    {
        return $this->apellidos;
    }

    public function setApellidos(string $apellidos): static
    {
        $this->apellidos = $apellidos;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getTelefono(): ?string
    {
        return $this->telefono;
    }

    public function setTelefono(string $telefono): static
    {
        $this->telefono = $telefono;

        return $this;
    }

    public function getDni(): ?string
    {
        return $this->dni;
    }

    public function setDni(string $dni): static
    {
        $this->dni = $dni;

        return $this;
    }

    public function isConfirmado(): bool
    {
        return $this->confirmado;
    }

    public function setConfirmado(bool $confirmado): self
    {
        $this->confirmado = $confirmado;
        return $this;
    }

    public function getTokenConfirmacion(): ?string
    {
        return $this->tokenConfirmacion;
    }

    public function setTokenConfirmacion(?string $token): self
    {
        $this->tokenConfirmacion = $token;
        return $this;
    }

    /**
     * @return Collection<int, Coche>
     */
    public function getCoches(): Collection
    {
        return $this->coches;
    }

    public function addCoch(Coche $coch): static
    {
        if (!$this->coches->contains($coch)) {
            $this->coches->add($coch);
            $coch->setUsuario($this);
        }

        return $this;
    }

    public function removeCoch(Coche $coch): static
    {
        if ($this->coches->removeElement($coch)) {
            // set the owning side to null (unless already changed)
            if ($coch->getUsuario() === $this) {
                $coch->setUsuario(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Cita>
     */
    public function getCitas(): Collection
    {
        return $this->citas;
    }

    public function addCita(Cita $cita): static
    {
        if (!$this->citas->contains($cita)) {
            $this->citas->add($cita);
            $cita->setUsuario($this);
        }

        return $this;
    }

    public function removeCita(Cita $cita): static
    {
        if ($this->citas->removeElement($cita)) {
            // set the owning side to null (unless already changed)
            if ($cita->getUsuario() === $this) {
                $cita->setUsuario(null);
            }
        }

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
            $factura->setUsuario($this);
        }

        return $this;
    }

    public function removeFactura(Factura $factura): static
    {
        if ($this->facturas->removeElement($factura)) {
            // set the owning side to null (unless already changed)
            if ($factura->getUsuario() === $this) {
                $factura->setUsuario(null);
            }
        }

        return $this;
    }
}
