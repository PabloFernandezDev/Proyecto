<?php

namespace App\Entity;

use App\Repository\ProvinciaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProvinciaRepository::class)]
class Provincia
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]

    #[Groups(['provincia:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 200)]
    #[Groups(['taller:read', 'mecanico:read', 'provincia:read'])]
    private ?string $nombre = null;

    /**
     * @var Collection<int, Taller>
     */
    #[ORM\OneToMany(targetEntity: Taller::class, mappedBy: 'provincia')]
    #[Groups(['provincia:read'])]
    private Collection $tallers;

    /**
     * @var Collection<int, Cita>
     */
    #[ORM\OneToMany(targetEntity: Cita::class, mappedBy: 'provincia')]
    private Collection $citas;

    public function __construct()
    {
        $this->tallers = new ArrayCollection();
        $this->citas = new ArrayCollection();
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
     * @return Collection<int, Taller>
     */
    public function getTallers(): Collection
    {
        return $this->tallers;
    }

    public function addTaller(Taller $taller): static
    {
        if (!$this->tallers->contains($taller)) {
            $this->tallers->add($taller);
            $taller->setProvincia($this);
        }

        return $this;
    }

    public function removeTaller(Taller $taller): static
    {
        if ($this->tallers->removeElement($taller)) {
            // set the owning side to null (unless already changed)
            if ($taller->getProvincia() === $this) {
                $taller->setProvincia(null);
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
            $cita->setProvincia($this);
        }

        return $this;
    }

    public function removeCita(Cita $cita): static
    {
        if ($this->citas->removeElement($cita)) {
            // set the owning side to null (unless already changed)
            if ($cita->getProvincia() === $this) {
                $cita->setProvincia(null);
            }
        }

        return $this;
    }
}
