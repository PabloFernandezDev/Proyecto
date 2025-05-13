<?php

namespace App\Entity;

use App\Repository\UsuarioRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UsuarioRepository::class)]
class Usuario
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['usuario:read','coches:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 200)]
    #[Groups(['usuario:read', 'coche:read','coches:read'])]
    private ?string $nombre = null;

    #[ORM\Column(length: 200)]
    #[Groups(['usuario:read', 'coche:read','coches:read'])]
    private ?string $apellidos = null;

    #[ORM\Column(length: 200)]
    #[Groups(['usuario:read', 'coche:read','coches:read'])]
    private ?string $email = null;

    #[ORM\Column(length: 200)]
    #[Groups(['usuario:read',])]
    private ?string $password = null;

    #[ORM\Column(length: 200)]
    #[Groups(['usuario:read', 'coche:read','coches:read'])]

    private ?string $telefono = null;

    #[ORM\Column(length: 200)]
    #[Groups(['usuario:read', 'coche:read'])]
    
    private ?string $dni = null;

    /**
     * @var Collection<int, Coche>
     */
    #[ORM\OneToMany(targetEntity: Coche::class, mappedBy: 'usuario')]
    private Collection $coches;

    public function __construct()
    {
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

    public function getApellidos(): ?string
    {
        return $this->apellidos;
    }

    public function setApellidos(string $apellidos): static
    {
        $this->apellidos = $apellidos;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

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

    public function getTelefono(): ?string
    {
        return $this->telefono;
    }

    public function setTelefono(string $telefono): static
    {
        $this->telefono = $telefono;

        return $this;
    }

    public function getDni(): ?string
    {
        return $this->dni;
    }

    public function setDni(string $dni): static
    {
        $this->dni = $dni;

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
            $coch->setUsuario($this);
        }

        return $this;
    }

    public function removeCoch(Coche $coch): static
    {
        if ($this->coches->removeElement($coch)) {
            // set the owning side to null (unless already changed)
            if ($coch->getUsuario() === $this) {
                $coch->setUsuario(null);
            }
        }

        return $this;
    }
}
