<?php

namespace App\Entity;

use App\Repository\MecanicoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity(repositoryClass: MecanicoRepository::class)]
class Mecanico
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['taller:read', 'mecanico:read'])]

    private ?int $id = null;


    #[ORM\ManyToOne(inversedBy: 'mecanicos')]
    #[MaxDepth(1)]
    #[Groups(['taller:read', 'mecanico:read'])]

    private ?Administrador $administrador = null;


    /**
     * @var Collection<int, Reparaciones>
     */
    #[ORM\OneToMany(targetEntity: Reparaciones::class, mappedBy: 'mecanico')]
    #[MaxDepth(1)]
    #[Groups(['mecanico:read'])]
    private Collection $reparaciones;

    #[ORM\Column(length: 255)]
    #[Groups(['coches:read', 'mecanico:read', 'taller:read', 'leerCoches:read'])]
    private ?string $Nombre = null;

    #[ORM\Column(length: 255)]
    #[Groups(['coches:read', 'mecanico:read', 'taller:read', 'leerCoches:read'])]
    private ?string $Apellidos = null;

    #[ORM\Column]
    #[Groups(['coches:read', 'mecanico:read', 'taller:read', 'leerCoches:read'])]
    private ?int $NumEmp = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    public function __construct()
    {
        $this->reparaciones = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAdministrador(): ?Administrador
    {
        return $this->administrador;
    }

    public function setAdministrador(?Administrador $administrador): static
    {
        $this->administrador = $administrador;

        return $this;
    }

    /**
     * @return Collection<int, Reparaciones>
     */
    public function getReparaciones(): Collection
    {
        return $this->reparaciones;
    }

    public function addReparacione(Reparaciones $reparacione): static
    {
        if (!$this->reparaciones->contains($reparacione)) {
            $this->reparaciones->add($reparacione);
            $reparacione->setMecanico($this);
        }

        return $this;
    }

    public function removeReparacione(Reparaciones $reparacione): static
    {
        if ($this->reparaciones->removeElement($reparacione)) {
            // set the owning side to null (unless already changed)
            if ($reparacione->getMecanico() === $this) {
                $reparacione->setMecanico(null);
            }
        }

        return $this;
    }

    public function getNombre(): ?string
    {
        return $this->Nombre;
    }

    public function setNombre(string $Nombre): static
    {
        $this->Nombre = $Nombre;

        return $this;
    }

    public function getApellidos(): ?string
    {
        return $this->Apellidos;
    }

    public function setApellidos(string $Apellidos): static
    {
        $this->Apellidos = $Apellidos;

        return $this;
    }

    public function getNumEmp(): ?int
    {
        return $this->NumEmp;
    }

    public function setNumEmp(int $NumEmp): static
    {
        $this->NumEmp = $NumEmp;

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
}
