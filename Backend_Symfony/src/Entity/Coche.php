<?php

namespace App\Entity;

use App\Repository\CocheRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CocheRepository::class)]
class Coche
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Usuario::class,inversedBy: 'coches')]
    private ?usuario $usuario = null;

    #[ORM\ManyToOne(inversedBy: 'coches')]
    private ?marca $marca = null;

    /**
     * @var Collection<int, Reparaciones>
     */
    #[ORM\OneToMany(targetEntity: Reparaciones::class, mappedBy: 'coche')]
    private Collection $reparaciones;

    public function __construct()
    {
        $this->reparaciones = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsuarioId(): ?usuario
    {
        return $this->usuario;
    }

    public function setUsuarioId(?usuario $usuario): static
    {
        $this->usuario = $usuario;

        return $this;
    }

    public function getMarca(): ?marca
    {
        return $this->marca;
    }

    public function setMarca(?marca $marca): static
    {
        $this->marca = $marca;

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
            $reparacione->setCoche($this);
        }

        return $this;
    }

    public function removeReparacione(Reparaciones $reparacione): static
    {
        if ($this->reparaciones->removeElement($reparacione)) {
            // set the owning side to null (unless already changed)
            if ($reparacione->getCoche() === $this) {
                $reparacione->setCoche(null);
            }
        }

        return $this;
    }

    
}
