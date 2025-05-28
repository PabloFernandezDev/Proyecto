<?php

namespace App\Entity;

use App\Repository\CocheRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CocheRepository::class)]
class Coche
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['coche:read', 'coches:read', 'cita:read', 'mecanico:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Usuario::class, inversedBy: 'coches')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups(['coche:read', 'coches:read', 'mecanico:read'])]
    private ?Usuario $usuario = null;

    #[ORM\ManyToOne(inversedBy: 'coches')]
    #[Groups(['coche:read', 'coches:read', 'mecanico:read', 'cita:read'])]
    private ?Marca $marca = null;


    #[ORM\ManyToOne(inversedBy: 'coches')]
    #[Groups(['coche:read', 'coches:read', 'mecanico:read', 'cita:read'])]
    private ?Modelo $modelo = null;

    #[ORM\ManyToOne(targetEntity: Taller::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['coche:read', 'coches:read', 'mecanico:read'])]
    private ?Taller $taller = null;


    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Image(
        maxSize: "5M",
        mimeTypes: ["image/jpeg", "image/png", "image/webp"],
        mimeTypesMessage: "Por favor sube una imagen válida (JPG, PNG, WEBP)"
    )]
    #[Groups(['coche:read', 'coches:read', 'mecanico:read'])]
    private ?string $imagen = null;


    #[ORM\Column(type: 'integer', nullable: true)]
    #[Groups(['coche:read', 'coches:read', 'mecanico:read'])]
    private ?int $año = null;

    /**
     * @var Collection<int, Reparaciones>
     */
    #[ORM\OneToMany(mappedBy: 'coche', targetEntity: Reparaciones::class, cascade: ['remove'], orphanRemoval: true)]
    #[Groups(['coches:read'])]

    private Collection $reparaciones;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['coche:read', 'coches:read', 'mecanico:read', 'cita:read'])]
    private ?string $Matricula = null;


    public function __construct()
    {
        $this->reparaciones = new ArrayCollection();
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

    public function getMarca(): ?Marca
    {
        return $this->marca;
    }

    public function setMarca(?Marca $marca): static
    {
        $this->marca = $marca;

        return $this;
    }

    public function getModelo(): ?Modelo
    {
        return $this->modelo;
    }

    public function setModelo(?Modelo $modelo): static
    {
        $this->modelo = $modelo;

        return $this;
    }

    public function getImagen(): ?string
    {
        return $this->imagen;
    }

    public function setImagen(?string $imagen): static
    {
        $this->imagen = $imagen;
        return $this;
    }

    public function getAño(): ?int
    {
        return $this->año;
    }

    public function setAño(?int $año): static
    {
        $this->año = $año;
        return $this;
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

    public function getMatricula(): ?string
    {
        return $this->Matricula;
    }

    public function setMatricula(string $Matricula): static
    {
        $this->Matricula = $Matricula;

        return $this;
    }



}
