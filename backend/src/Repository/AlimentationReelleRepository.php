<?php

namespace App\Repository;

use App\Entity\AlimentationReelle;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AlimentationReelle>
 */
class AlimentationReelleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AlimentationReelle::class);
    }
}
