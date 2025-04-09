<?php

namespace App\Entity;

use App\Repository\AdministradorRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AdministradorRepository::class)]
class Administrador
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'administradors')]
    private ?Taller $taller = null;

    /**
     * @var Collection<int, Mecanico>
     */
    #[ORM\OneToMany(targetEntity: Mecanico::class, mappedBy: 'administrador')]
    private Collection $mecanicos;

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
}
