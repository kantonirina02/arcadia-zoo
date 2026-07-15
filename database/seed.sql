SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO `role` (`id_role`, `label`) VALUES
(1, 'ROLE_ADMIN'),
(2, 'ROLE_EMPLOYE'),
(3, 'ROLE_VETERINAIRE');

-- Les mots de passe sont hachés avec l'équivalent de "password123" pour le test local
INSERT INTO `utilisateur` (`id_utilisateur`, `username`, `password`, `nom`, `prenom`, `role_id`) VALUES
(1, 'jose.admin@arcadia.com', '$2y$13$OaJ53X0xS1m71z5C/R8OZuMREO006FbyFMyy8v376oO/F03yFmyC2', 'Zoo', 'José', 1),
(2, 'jean.employe@arcadia.com', '$2y$13$OaJ53X0xS1m71z5C/R8OZuMREO006FbyFMyy8v376oO/F03yFmyC2', 'Dupont', 'Jean', 2),
(3, 'marie.veto@arcadia.com', '$2y$13$OaJ53X0xS1m71z5C/R8OZuMREO006FbyFMyy8v376oO/F03yFmyC2', 'Martin', 'Marie', 3);

INSERT INTO `service` (`id_service`, `nom`, `description`) VALUES
(1, 'Restauration', 'Profitez de nos différents points de restauration éco-responsables au sein du parc.'),
(2, 'Visite Guidée des Habitats', 'Parcourez les habitats accompagnés par nos guides experts. Service gratuit.'),
(3, 'Le Petit Train du Zoo', 'Visitez l''intégralité du parc sans vous fatiguer à bord de notre train électrique.');

INSERT INTO `habitat` (`id_habitat`, `nom`, `description`, `commentaire_veterinaire`) VALUES
(1, 'La Savane Africaine', 'Un vaste espace chaud et sablonneux dédié aux animaux de la plaine africaine.', 'Rien à signaler. L''état des clôtures et de la végétation est excellent.'),
(2, 'La Jungle Tropicale', 'Une serre humide luxuriante abritant une faune exotique colorée.', 'Contrôler régulièrement le niveau d''humidité de la serre.'),
(3, 'Le Marais Breton', 'Un écosystème humide local typique pour préserver les espèces régionales.', NULL);

INSERT INTO `race` (`id_race`, `label`) VALUES
(1, 'Lion d''Afrique'),
(2, 'Girafe de Nubie'),
(3, 'Perroquet Ara'),
(4, 'Alligator du Mississippi');

INSERT INTO `animal` (`id_animal`, `prenom`, `race_id`, `habitat_id`) VALUES
(1, 'Médor', 1, 1),
(2, 'Bella', 2, 1),
(3, 'Titi', 3, 2),
(4, 'Bubulle', 4, 3);

INSERT INTO `image` (`id_image`, `image_path`, `habitat_id`, `animal_id`) VALUES
(1, 'foret.jpg', NULL, NULL),
(2, 'habitat-savane.jpg', 1, NULL),
(3, 'habitat-jungle.jpg', 2, NULL),
(4, 'habitat-marais.jpg', 3, NULL),
(5, 'animal-lion.jpg', NULL, 1),
(6, 'animal-perroquet.jpg', NULL, 3),
(7, 'animal-alligator.jpg', NULL, 4);

INSERT INTO `rapport_veterinaire` (`id_rapport`, `date`, `etat_animal`, `nourriture_proposee`, `grammage_propose`, `detail_etat`, `animal_id`, `veterinaire_id`) VALUES
(1, '2026-07-15', 'Excellent', 'Viande rouge fraîche', 5000, 'Animal en excellente forme. Très réactif.', 1, 3);

INSERT INTO `alimentation_reelle` (`id_alimentation`, `date`, `heure`, `nourriture_donnee`, `quantite_donnee`, `animal_id`, `employe_id`) VALUES
(1, '2026-07-15', '08:30:00', 'Viande de bœuf', 5000, 1, 2);

INSERT INTO `avis` (`id_avis`, `pseudo`, `commentaire`, `is_visible`) VALUES
(1, 'Lucas_P', 'Un zoo magnifique et propre. Les animaux semblent très heureux.', 1),
(2, 'Emma_V', 'L''engagement écologique est vraiment visible, bravo !', 1),
(3, 'Test_Visiteur', 'Avis en cours de modération.', 0);

INSERT INTO `horaire` (`id_horaire`, `jour_semaine`, `ouverture`, `fermeture`) VALUES
(1, 'Lundi', '09:00:00', '18:30:00'),
(2, 'Mardi', '09:00:00', '18:30:00'),
(3, 'Mercredi', '09:00:00', '18:30:00'),
(4, 'Jeudi', '09:00:00', '18:30:00'),
(5, 'Vendredi', '09:00:00', '18:30:00'),
(6, 'Samedi', '09:00:00', '19:00:00'),
(7, 'Dimanche', '09:00:00', '19:00:00');

SET FOREIGN_KEY_CHECKS = 1;
