<?php

namespace App\Entity;

use App\Repository\MecanicoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MecanicoRepository::class)]
class Mecanico
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'mecanicos')]
    private ?administrador $administrador = null;

    /**
     * @var Collection<int, Reparaciones>
     */
    #[ORM\OneToMany(targetEntity: Reparaciones::class, mappedBy: 'mecanico')]
    private Collection $reparaciones;

    public function __construct()
    {
        $this->reparaciones = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAdministrador(): ?administrador
    {
        return $this->administrador;
    }

    public function setAdministrador(?administrador $administrador): static
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
}
