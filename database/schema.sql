SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `alimentation_reelle`;
DROP TABLE IF EXISTS `rapport_veterinaire`;
DROP TABLE IF EXISTS `image`;
DROP TABLE IF EXISTS `animal`;
DROP TABLE IF EXISTS `race`;
DROP TABLE IF EXISTS `habitat`;
DROP TABLE IF EXISTS `service`;
DROP TABLE IF EXISTS `horaire`;
DROP TABLE IF EXISTS `avis`;
DROP TABLE IF EXISTS `utilisateur`;
DROP TABLE IF EXISTS `role`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `role` (
    `id_role` INT AUTO_INCREMENT PRIMARY KEY,
    `label` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `utilisateur` (
    `id_utilisateur` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(180) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `nom` VARCHAR(50) NOT NULL,
    `prenom` VARCHAR(50) NOT NULL,
    `role_id` INT NOT NULL,
    CONSTRAINT `fk_utilisateur_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `service` (
    `id_service` INT AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `habitat` (
    `id_habitat` INT AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `commentaire_veterinaire` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `race` (
    `id_race` INT AUTO_INCREMENT PRIMARY KEY,
    `label` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `animal` (
    `id_animal` INT AUTO_INCREMENT PRIMARY KEY,
    `prenom` VARCHAR(50) NOT NULL,
    `race_id` INT NOT NULL,
    `habitat_id` INT NOT NULL,
    CONSTRAINT `fk_animal_race` FOREIGN KEY (`race_id`) REFERENCES `race` (`id_race`),
    CONSTRAINT `fk_animal_habitat` FOREIGN KEY (`habitat_id`) REFERENCES `habitat` (`id_habitat`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `image` (
    `id_image` INT AUTO_INCREMENT PRIMARY KEY,
    `image_path` VARCHAR(255) NOT NULL,
    `habitat_id` INT DEFAULT NULL,
    `animal_id` INT DEFAULT NULL,
    CONSTRAINT `fk_image_habitat` FOREIGN KEY (`habitat_id`) REFERENCES `habitat` (`id_habitat`) ON DELETE CASCADE,
    CONSTRAINT `fk_image_animal` FOREIGN KEY (`animal_id`) REFERENCES `animal` (`id_animal`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `rapport_veterinaire` (
    `id_rapport` INT AUTO_INCREMENT PRIMARY KEY,
    `date` DATE NOT NULL,
    `etat_animal` VARCHAR(100) NOT NULL,
    `nourriture_proposee` VARCHAR(100) NOT NULL,
    `grammage_propose` INT NOT NULL,
    `detail_etat` TEXT DEFAULT NULL,
    `animal_id` INT NOT NULL,
    `veterinaire_id` INT NOT NULL,
    CONSTRAINT `fk_rapport_animal` FOREIGN KEY (`animal_id`) REFERENCES `animal` (`id_animal`) ON DELETE CASCADE,
    CONSTRAINT `fk_rapport_veterinaire` FOREIGN KEY (`veterinaire_id`) REFERENCES `utilisateur` (`id_utilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `alimentation_reelle` (
    `id_alimentation` INT AUTO_INCREMENT PRIMARY KEY,
    `date` DATE NOT NULL,
    `heure` TIME NOT NULL,
    `nourriture_donnee` VARCHAR(100) NOT NULL,
    `quantite_donnee` INT NOT NULL,
    `animal_id` INT NOT NULL,
    `employe_id` INT NOT NULL,
    CONSTRAINT `fk_alimentation_animal` FOREIGN KEY (`animal_id`) REFERENCES `animal` (`id_animal`) ON DELETE CASCADE,
    CONSTRAINT `fk_alimentation_employe` FOREIGN KEY (`employe_id`) REFERENCES `utilisateur` (`id_utilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `avis` (
    `id_avis` INT AUTO_INCREMENT PRIMARY KEY,
    `pseudo` VARCHAR(50) NOT NULL,
    `commentaire` VARCHAR(255) NOT NULL,
    `is_visible` TINYINT(1) DEFAULT 0 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `horaire` (
    `id_horaire` INT AUTO_INCREMENT PRIMARY KEY,
    `jour_semaine` VARCHAR(15) NOT NULL UNIQUE,
    `ouverture` TIME NOT NULL,
    `fermeture` TIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
