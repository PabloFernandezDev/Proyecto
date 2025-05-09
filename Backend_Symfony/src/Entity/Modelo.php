<?php

namespace App\Entity;

use App\Repository\ModeloRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ModeloRepository::class)]
class Modelo
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 200)]
    #[Groups(['modelo:read', 'coche:read'])]
    
    private ?string $nombre = null;

    #[ORM\ManyToOne(inversedBy: 'modelos')]
    private ?Marca $marca = null;



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

    public function getMarca(): ?marca
    {
        return $this->marca;
    }

    public function setMarca(?marca $marca): static
    {
        $this->marca = $marca;

        return $this;
    }

}
