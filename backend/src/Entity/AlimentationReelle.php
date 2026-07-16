<?php

namespace App\Entity;

use App\Repository\AlimentationReelleRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AlimentationReelleRepository::class)]
class AlimentationReelle
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $heure = null;

    #[ORM\Column(length: 100)]
    private ?string $nourriture_donnee = null;

    #[ORM\Column]
    private ?int $quantite_donnee = null;

    #[ORM\ManyToOne(targetEntity: Animal::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Animal $animal = null;

    #[ORM\ManyToOne(targetEntity: Utilisateur::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Utilisateur $employe = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getHeure(): ?\DateTimeInterface
    {
        return $this->heure;
    }

    public function setHeure(\DateTimeInterface $heure): static
    {
        $this->heure = $heure;

        return $this;
    }

    public function getNourritureDonnee(): ?string
    {
        return $this->nourriture_donnee;
    }

    public function setNourritureDonnee(string $nourriture_donnee): static
    {
        $this->nourriture_donnee = $nourriture_donnee;

        return $this;
    }

    public function getQuantiteDonnee(): ?int
    {
        return $this->quantite_donnee;
    }

    public function setQuantiteDonnee(int $quantite_donnee): static
    {
        $this->quantite_donnee = $quantite_donnee;

        return $this;
    }

    public function getAnimal(): ?Animal
    {
        return $this->animal;
    }

    public function setAnimal(?Animal $animal): static
    {
        $this->animal = $animal;

        return $this;
    }

    public function getEmploye(): ?Utilisateur
    {
        return $this->employe;
    }

    public function setEmploye(?Utilisateur $employe): static
    {
        $this->employe = $employe;

        return $this;
    }
}
