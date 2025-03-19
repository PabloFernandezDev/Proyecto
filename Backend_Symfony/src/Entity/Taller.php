<?php

namespace App\Entity;

use App\Repository\TallerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TallerRepository::class)]
class Taller
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'tallers')]
    private ?provincia $provincia = null;

    #[ORM\Column(length: 200)]
    private ?string $direccion = null;

    /**
     * @var Collection<int, Administrador>
     */
    #[ORM\OneToMany(targetEntity: Administrador::class, mappedBy: 'taller')]
    private Collection $administradors;

    public function __construct()
    {
        $this->administradors = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProvincia(): ?provincia
    {
        return $this->provincia;
    }

    public function setProvincia(?provincia $provincia): static
    {
        $this->provincia = $provincia;

        return $this;
    }

    public function getDireccion(): ?string
    {
        return $this->direccion;
    }

    public function setDireccion(string $direccion): static
    {
        $this->direccion = $direccion;

        return $this;
    }

    /**
     * @return Collection<int, Administrador>
     */
    public function getAdministradors(): Collection
    {
        return $this->administradors;
    }

    public function addAdministrador(Administrador $administrador): static
    {
        if (!$this->administradors->contains($administrador)) {
            $this->administradors->add($administrador);
            $administrador->setTaller($this);
        }

        return $this;
    }

    public function removeAdministrador(Administrador $administrador): static
    {
        if ($this->administradors->removeElement($administrador)) {
            // set the owning side to null (unless already changed)
            if ($administrador->getTaller() === $this) {
                $administrador->setTaller(null);
            }
        }

        return $this;
    }
}
