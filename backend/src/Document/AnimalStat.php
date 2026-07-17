<?php

namespace App\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

#[MongoDB\Document(collection: "animal_stats")]
class AnimalStat
{
    #[MongoDB\Id]
    private ?string $id = null;

    #[MongoDB\Field(type: "int")]
    #[MongoDB\Index(unique: true)]
    private ?int $animalId = null;

    #[MongoDB\Field(type: "int")]
    private int $consultations = 0;

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getAnimalId(): ?int
    {
        return $this->animalId;
    }

    public function setAnimalId(int $animalId): self
    {
        $this->animalId = $animalId;
        return $this;
    }

    public function getConsultations(): int
    {
        return $this->consultations;
    }

    public function setConsultations(int $consultations): self
    {
        $this->consultations = $consultations;
        return $this;
    }

    public function incrementConsultations(): self
    {
        $this->consultations++;
        return $this;
    }
}
