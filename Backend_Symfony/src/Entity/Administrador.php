<?php

namespace App\Entity;

use App\Repository\AdministradorRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity(repositoryClass: AdministradorRepository::class)]
class Administrador
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'administradors', cascade: ['persist'])]
    #[Groups(['mecanico:read'])]

    private ?Taller $taller = null;

    /**
     * @var Collection<int, Mecanico>
     */
    #[ORM\OneToMany(targetEntity: Mecanico::class, mappedBy: 'administrador')]
    #[MaxDepth(1)]
    #[Groups(['mecanico:read', 'taller:read'])]
    private Collection $mecanicos;

    #[ORM\Column(length: 255)]
    private ?string $Nombre = null;

    #[ORM\Column(length: 255)]
    private ?string $Apellidos = null;

    #[ORM\Column(type: 'integer')]
    #[Groups(['mecanico:read'])]

    private ?int $NumEmp = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    public function __construct()
    {
        $this->mecanicos = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTaller(): ?Taller
    {
        return $this->taller;
    }

    public function setTaller(?Taller $taller): static
    {
        $this->taller = $taller;

        return $this;
    }

    /**
     * @return Collection<int, Mecanico>
     */
    public function getMecanicos(): Collection
    {
        return $this->mecanicos;
    }

    public function addMecanico(Mecanico $mecanico): static
    {
        if (!$this->mecanicos->contains($mecanico)) {
            $this->mecanicos->add($mecanico);
            $mecanico->setAdministrador($this);
        }

        return $this;
    }

    public function removeMecanico(Mecanico $mecanico): static
    {
        if ($this->mecanicos->removeElement($mecanico)) {
            // set the owning side to null (unless already changed)
            if ($mecanico->getAdministrador() === $this) {
                $mecanico->setAdministrador(null);
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
