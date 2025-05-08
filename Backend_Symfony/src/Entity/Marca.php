<?php

namespace App\Entity;

use App\Repository\MarcaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MarcaRepository::class)]
class Marca
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 200)]
    private ?string $nombre = null;


    /**
     * @var Collection<int, Modelo>
     */
    #[ORM\OneToMany(targetEntity: Modelo::class, mappedBy: 'marca')]
    private Collection $modelos;

    /**
     * @var Collection<int, Coche>
     */
    #[ORM\OneToMany(targetEntity: Coche::class, mappedBy: 'marca')]
    private Collection $coches;



    public function __construct()
    {
        $this->modelos = new ArrayCollection();
        $this->coches = new ArrayCollection();
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

    /**
     * @return Collection<int, Modelo>
     */
    public function getModelos(): Collection
    {
        return $this->modelos;
    }

    public function addModelo(Modelo $modelo): static
    {
        if (!$this->modelos->contains($modelo)) {
            $this->modelos->add($modelo);
            $modelo->setMarca($this);
        }

        return $this;
    }

    public function removeModelo(Modelo $modelo): static
    {
        if ($this->modelos->removeElement($modelo)) {
            // set the owning side to null (unless already changed)
            if ($modelo->getMarca() === $this) {
                $modelo->setMarca(null);
            }
        }

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
            $coch->setMarca($this);
        }

        return $this;
    }

    public function removeCoch(Coche $coch): static
    {
        if ($this->coches->removeElement($coch)) {
            // set the owning side to null (unless already changed)
            if ($coch->getMarca() === $this) {
                $coch->setMarca(null);
            }
        }

        return $this;
    }

}
