-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 04 mars 2026 à 02:12
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `database_clinique`
--

-- --------------------------------------------------------

--
-- Structure de la table `consultations`
--

CREATE TABLE `consultations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `rendez_vous_id` bigint(20) UNSIGNED NOT NULL,
  `medecin_id` bigint(20) UNSIGNED NOT NULL,
  `malade_id` bigint(20) UNSIGNED NOT NULL,
  `date_consult` date DEFAULT NULL,
  `heure_consult` time DEFAULT NULL,
  `motif` text DEFAULT NULL,
  `diagnostic` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `prescription` text DEFAULT NULL,
  `statut` varchar(255) NOT NULL DEFAULT 'en attente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `consultations`
--

INSERT INTO `consultations` (`id`, `rendez_vous_id`, `medecin_id`, `malade_id`, `date_consult`, `heure_consult`, `motif`, `diagnostic`, `notes`, `prescription`, `statut`, `created_at`, `updated_at`) VALUES
(2, 14, 6, 9, '2026-02-21', NULL, 'Douleurs thoraciques', 'Angine de poitrine stable', NULL, 'Repos et médicaments prescrits', 'en attente', '2026-02-23 13:20:35', '2026-02-23 13:35:34'),
(3, 18, 6, 9, '2026-02-22', NULL, 'Douleurs thoraciques', 'Angine de poitrine stable', NULL, 'Repos et médicaments prescrits', 'en attente', '2026-02-24 00:02:59', '2026-02-24 00:02:59');

-- --------------------------------------------------------

--
-- Structure de la table `dossier_medicals`
--

CREATE TABLE `dossier_medicals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `malade_id` bigint(20) UNSIGNED NOT NULL,
  `medecin_id` bigint(20) UNSIGNED DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `dossier_medicals`
--

INSERT INTO `dossier_medicals` (`id`, `malade_id`, `medecin_id`, `notes`, `created_at`, `updated_at`) VALUES
(3, 4, 4, 'bachfa', '2026-02-01 19:28:41', '2026-02-01 19:28:41'),
(4, 5, 5, 'aedsh', '2026-02-10 15:22:25', '2026-02-10 15:22:25'),
(5, 4, 4, 'aaa', '2026-02-23 00:00:38', '2026-02-23 00:00:38'),
(6, 4, 4, 'aaa', '2026-02-23 00:00:40', '2026-02-23 00:00:40'),
(7, 4, 4, 'aaa', '2026-02-23 00:00:42', '2026-02-23 00:00:42'),
(8, 4, 4, 'aaadtrhdthd', '2026-02-23 00:00:46', '2026-02-23 00:00:46'),
(9, 4, 4, 'aaadtrhdthd', '2026-02-23 00:00:56', '2026-02-23 00:00:56'),
(10, 7, 4, 'dfgfgs', '2026-02-23 00:01:22', '2026-02-23 00:01:22'),
(11, 7, 4, 'dfgfgsfd', '2026-02-23 00:03:37', '2026-02-23 00:03:37'),
(12, 7, 4, 'dfgfgsfd', '2026-02-23 00:07:30', '2026-02-23 00:07:30'),
(13, 4, 4, 'resdgS', '2026-02-23 00:07:56', '2026-02-23 00:07:56'),
(14, 7, 4, 'cvsdfas', '2026-02-23 00:12:34', '2026-02-23 00:12:34'),
(15, 7, 4, 'cvsdfas', '2026-02-23 00:12:51', '2026-02-23 00:12:51'),
(16, 7, 4, 'cvsdfas', '2026-02-23 00:18:06', '2026-02-23 00:18:06'),
(17, 7, 4, 'cvsdfas', '2026-02-23 00:18:22', '2026-02-23 00:18:22'),
(18, 7, 4, 'cvsdfas', '2026-02-23 00:26:49', '2026-02-23 00:26:49'),
(19, 10, 4, 'fgnfnfgh', '2026-02-23 14:16:48', '2026-02-23 14:16:48');

-- --------------------------------------------------------

--
-- Structure de la table `dossier_medical_attachments`
--

CREATE TABLE `dossier_medical_attachments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `dossier_medical_id` bigint(20) UNSIGNED NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `dossier_medical_attachments`
--

INSERT INTO `dossier_medical_attachments` (`id`, `dossier_medical_id`, `file_path`, `file_type`, `original_name`, `created_at`, `updated_at`) VALUES
(4, 3, 'dossier_medical_attachments/oXg8TfXE6m2TBpxjcnODrIn1kHZmT9nr3HJCxNvw.jpg', 'image', 'AdobeStock_1596388227_Preview.jpeg', '2026-02-01 19:28:41', '2026-02-01 19:28:41'),
(5, 4, 'dossier_medical_attachments/RJNZtIUukfLiSTpgjdUHaeE7cEjEwLVlaxQJzQPU.jpg', 'image', 'AdobeStock_1596388227_Preview.jpeg', '2026-02-10 15:22:25', '2026-02-10 15:22:25'),
(6, 18, 'medical_record_attachments/E4AXzvsoo2lHpaGhB4Wx1oZjjSgWupFU8ZuK1lFb.png', 'image', 'LOGO.png', '2026-02-23 00:26:49', '2026-02-23 00:26:49'),
(7, 19, 'medical_record_attachments/3oqXDEOh9Q9NySywGh0cuQfLXZtxF3IASjHzO713.pdf', 'pdf', 'p1.pdf', '2026-02-23 14:16:48', '2026-02-23 14:16:48');

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `malades`
--

CREATE TABLE `malades` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `utilisateur_id` bigint(20) UNSIGNED NOT NULL,
  `date_naissance` date DEFAULT NULL,
  `sexe` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `malades`
--

INSERT INTO `malades` (`id`, `utilisateur_id`, `date_naissance`, `sexe`, `telephone`, `adresse`, `created_at`, `updated_at`) VALUES
(4, 10, '2002-12-12', 'M', '0558534641', 'mostafa filali', '2026-02-01 18:39:43', '2026-02-22 05:51:53'),
(5, 12, '2022-06-22', 'M', '0558797411', 'kkskh', '2026-02-10 15:02:21', '2026-02-10 15:02:21'),
(7, 15, '2022-06-24', 'M', '05487', '55', '2026-02-22 23:32:57', '2026-02-22 23:32:57'),
(8, 16, '2025-06-03', 'F', 'sfcsd@gmail.com', 'dfdfd', '2026-02-23 00:32:07', '2026-02-23 00:32:07'),
(9, 20, '1979-03-15', 'Homme', '0698765432', 'Casablanca', '2026-02-23 13:13:33', '2026-02-23 13:13:33'),
(10, 21, '2024-02-23', 'F', '1122121', '12121', '2026-02-23 14:04:18', '2026-02-23 14:04:18');

-- --------------------------------------------------------

--
-- Structure de la table `medecins`
--

CREATE TABLE `medecins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `utilisateur_id` bigint(20) UNSIGNED NOT NULL,
  `specialite` varchar(255) NOT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `numero_ordre` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `medecins`
--

INSERT INTO `medecins` (`id`, `utilisateur_id`, `specialite`, `telephone`, `numero_ordre`, `created_at`, `updated_at`) VALUES
(4, 11, '9alb', '0558797411', 2, '2026-02-01 18:58:58', '2026-02-01 18:58:58'),
(5, 13, 'ckard', '0558797416', 5, '2026-02-10 15:08:12', '2026-02-10 15:08:12'),
(6, 17, 'Cardiologie', '0612345678', 12345, '2026-02-23 13:13:33', '2026-02-23 13:13:33');

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2026_01_10_135159_create_malades_table', 1),
(6, '2026_01_12_193520_create_medecins_table', 1),
(7, '2026_01_13_095401_create_rendez_vous_table', 1),
(8, '2026_01_15_220138_create_consultations_table', 1),
(9, '2026_01_15_234328_create_dossier_medicals_table', 1),
(10, '2026_01_23_185020_add_role_to_users_table', 2),
(11, '2026_01_25_145827_update_users_role_enum_add_medecin', 3),
(12, '2026_01_25_150324_update_users_role_enum_add_patient', 4),
(13, '2026_01_25_151835_add_date_and_heure_columns_to_rendez_vous_table', 5),
(14, '2026_01_26_000000_update_rendez_vous_for_patient_images', 6),
(15, '2026_01_26_000001_make_date_time_nullable_in_rendez_vous', 7),
(16, '2026_01_27_000001_remove_antecedents_from_dossier_medicals', 8),
(17, '2026_01_27_000002_create_dossier_medical_attachments_table', 8),
(18, '2026_01_27_000003_add_medecin_id_to_dossier_medicals', 8),
(19, '2026_02_15_231853_rename_rendez_vous_columns_to_english', 9),
(20, '2026_02_23_000000_add_cancellation_reason_to_rendez_vous_table', 10),
(21, '2026_02_24_012821_add_telephone_to_users_table', 11);

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `rendez_vous`
--

CREATE TABLE `rendez_vous` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `patient_id` bigint(20) UNSIGNED NOT NULL,
  `doctor_id` bigint(20) UNSIGNED DEFAULT NULL,
  `appointment_date` date DEFAULT NULL,
  `appointment_time` time DEFAULT NULL,
  `date_heure_rdv` datetime DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'en attente',
  `type` varchar(255) NOT NULL DEFAULT 'consultation',
  `reason` text NOT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `rendez_vous`
--

INSERT INTO `rendez_vous` (`id`, `patient_id`, `doctor_id`, `appointment_date`, `appointment_time`, `date_heure_rdv`, `status`, `type`, `reason`, `cancellation_reason`, `created_at`, `updated_at`) VALUES
(9, 4, 4, '2026-02-27', '21:02:00', NULL, 'complété', 'consultation', 'ana mrid', NULL, '2026-02-01 18:42:26', '2026-02-01 19:32:38'),
(10, 5, 5, '2026-02-18', '19:11:00', NULL, 'complété', 'consultation', 'nhjkhjzj', NULL, '2026-02-10 15:05:27', '2026-02-10 15:33:29'),
(11, 7, 4, '2026-03-05', '05:13:00', NULL, 'confirmed', 'consultation', 'ali@gmail.com556', NULL, '2026-02-22 23:36:35', '2026-02-23 00:11:47'),
(13, 7, 4, '2026-02-25', '04:59:00', NULL, 'confirmed', 'consultation', 'ali@gmail.comali@gmail.com1', NULL, '2026-02-22 23:39:17', '2026-02-22 23:57:12'),
(14, 9, 6, '2026-02-24', '10:00:00', NULL, 'confirmé', 'consultation', 'Consultation de routine', NULL, '2026-02-23 13:20:35', '2026-02-23 13:20:35'),
(15, 10, NULL, NULL, NULL, NULL, 'cancelled', 'consultation', '12121212121', 'mamlihach', '2026-02-23 14:05:04', '2026-02-23 14:08:09'),
(16, 10, 4, '2026-02-12', '16:14:00', NULL, 'pending', 'consultation', 'gfbhfdffff', NULL, '2026-02-23 14:11:10', '2026-02-23 14:18:47'),
(17, 10, NULL, NULL, NULL, NULL, 'pending', 'consultation', 'xcvxzvzxcv', NULL, '2026-02-23 14:18:14', '2026-02-23 14:18:14'),
(18, 9, 6, '2026-02-25', '10:00:00', NULL, 'confirmé', 'consultation', 'Consultation de routine', NULL, '2026-02-24 00:02:59', '2026-02-24 00:02:59'),
(20, 4, 4, '2026-03-05', '00:54:00', NULL, 'confirmed', 'consultation', '12345678910', NULL, '2026-02-27 22:06:54', '2026-02-27 22:52:13');

-- --------------------------------------------------------

--
-- Structure de la table `rendez_vous_images`
--

CREATE TABLE `rendez_vous_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `rendez_vous_id` bigint(20) UNSIGNED NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `rendez_vous_images`
--

INSERT INTO `rendez_vous_images` (`id`, `rendez_vous_id`, `image_path`, `created_at`, `updated_at`) VALUES
(5, 9, 'rendez_vous_images/RZuoShWr8Rif1bHfO3J7MxeSVlEjeRFV9p6oyDpM.png', '2026-02-01 18:42:26', '2026-02-01 18:42:26'),
(6, 9, 'rendez_vous_images/PV9j3z0laQ544xkg8kWNu53FMvep3k3rU35oNpvo.jpg', '2026-02-01 18:42:26', '2026-02-01 18:42:26'),
(7, 10, 'rendez_vous_images/EVdm9ufWVkbDhllSsL8qXtZNcw6su3w5NBfGZBbU.jpg', '2026-02-10 15:05:27', '2026-02-10 15:05:27'),
(8, 11, 'rendez_vous_images/Zz4mOOXi2nVtyhcTwVH1zwAluEdSXBVpnx50ABg3.png', '2026-02-22 23:36:35', '2026-02-22 23:36:35'),
(10, 13, 'rendez_vous_images/UcTLy3udMxstMSBuVfFjOnz3P8YDVYb3sw1CFJ1v.jpg', '2026-02-22 23:39:17', '2026-02-22 23:39:17'),
(11, 15, 'rendez_vous_images/gjEd3KDZ27EI9kFCVBPlPp08wzmhi24h9rmm1ZEF.png', '2026-02-23 14:05:04', '2026-02-23 14:05:04'),
(12, 16, 'rendez_vous_images/OEunGqkq4S9qE4OLniTiSHR68yap4qPyW2ZPPvOv.png', '2026-02-23 14:11:10', '2026-02-23 14:11:10'),
(13, 17, 'rendez_vous_images/upjsChCp9EaWZj5hD3Ibf1j0dJUjSAUP2H1AxFv5.jpg', '2026-02-23 14:18:14', '2026-02-23 14:18:14'),
(15, 20, 'rendez_vous_images/PJNhaGbP6GMZnePoYnUFwdj84DxB1vjGp9r6BJMx.png', '2026-02-27 22:06:54', '2026-02-27 22:06:54');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `role` enum('admin','user','medecin','patient') NOT NULL DEFAULT 'user',
  `mot_de_passe` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `email`, `telephone`, `role`, `mot_de_passe`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(6, 'Admin', 'Quick', 'quick@admin.com', NULL, 'admin', '$2y$12$abDbVZ5Tm9ejFqUQ8RjhMu7Yj7K4c9.L8I9dWVPBNQaSQjLQbozDq', NULL, NULL, '2026-01-23 18:40:01', '2026-01-23 18:40:01'),
(10, 'mouin', 'boulazib', 'mouin.mouin2002@gmail.com', NULL, 'patient', '$2y$12$oc3LCJ.XDtILbJ4XcFKPme6wFCFfY..1mopk98XeHO8/R7xCUOdeS', NULL, NULL, '2026-02-01 18:39:43', '2026-02-22 05:51:53'),
(11, 'Dr mouine', 'ana', 'mouinDr@gmail.com', NULL, 'medecin', '$2y$12$TqyAKbRNNmb9QT7XIbgd1OCbtiqJ5rUFWXCdtanCVn338KMLYEAFC', NULL, NULL, '2026-02-01 18:58:58', '2026-02-24 00:37:29'),
(12, 'JAMAL', 'BORORO', 'jamal@gmail.com', NULL, 'patient', '$2y$12$t8zHnNAuT4FuwesxsadONewSQsgJXvCP8FmYxXhXNsrpGinnvradq', NULL, NULL, '2026-02-10 15:02:21', '2026-02-10 15:02:21'),
(13, 'dr', 'test', 'test@test.com', NULL, 'medecin', '$2y$12$4wqG1IWtVL/MdTAZmbo.jO4SSIAkPb9Ki9jrEP9NFYdAJLZtWKe9C', NULL, NULL, '2026-02-10 15:08:12', '2026-02-10 15:08:12'),
(14, 'fhj', 'uji', 'ttt@gmail.com', NULL, 'patient', '$2y$12$S7UbKMAjz/gi9o5R.kjQjOpyHsfITFSsvo/ULBMl5TpHMPOoF7ZtK', NULL, NULL, '2026-02-22 05:52:44', '2026-02-22 05:52:44'),
(15, 'ali', 'ali', 'ali@gmail.com', NULL, 'patient', '$2y$12$HONx9qAMh92b4roF.oP6nuoocdA2AjqMQQoGRlTSru5UOB26hhhIq', NULL, NULL, '2026-02-22 23:32:57', '2026-02-22 23:32:57'),
(16, 'dddd', 'dddd', 'sfcsd@gmail.com', NULL, 'patient', '$2y$12$FgCa22IcMvSGqXT/bypevOZe0mz1anGhP8Fe1R.Pg3gOBLveCkZIm', NULL, NULL, '2026-02-23 00:32:07', '2026-02-23 00:32:07'),
(17, 'Bennani', 'Ahmed', 'doctor@clinic.ma', NULL, 'user', '$2y$12$QLRRs0URIwhNH2veGg3KtuHjH3/VS2NEj09/yIk6BZe4SalPLPS0m', NULL, NULL, '2026-02-23 13:05:02', '2026-02-24 00:02:59'),
(20, 'Alami', 'Mohammed', 'patient@clinic.ma', NULL, 'user', '$2y$12$HgZsZ9iPixdjUjg7BCGyqOjanNi.a4hAgyIUt9eMOQ/03eWi4yS1G', NULL, NULL, '2026-02-23 13:13:33', '2026-02-24 00:02:59'),
(21, '1111', '2222222', '11112222@gmail.com', NULL, 'patient', '$2y$12$08WBa/1Bnp/CHn6ftNBO2e2d3r4yRO/Fv/IilOiMM4a0K5OYjb7eK', NULL, NULL, '2026-02-23 14:04:18', '2026-02-23 14:04:18');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `consultations`
--
ALTER TABLE `consultations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `consultations_rendez_vous_id_foreign` (`rendez_vous_id`),
  ADD KEY `consultations_medecin_id_foreign` (`medecin_id`),
  ADD KEY `consultations_malade_id_foreign` (`malade_id`);

--
-- Index pour la table `dossier_medicals`
--
ALTER TABLE `dossier_medicals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dossier_medicals_malade_id_foreign` (`malade_id`),
  ADD KEY `dossier_medicals_medecin_id_foreign` (`medecin_id`);

--
-- Index pour la table `dossier_medical_attachments`
--
ALTER TABLE `dossier_medical_attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dossier_medical_attachments_dossier_medical_id_foreign` (`dossier_medical_id`);

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Index pour la table `malades`
--
ALTER TABLE `malades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `malades_utilisateur_id_foreign` (`utilisateur_id`);

--
-- Index pour la table `medecins`
--
ALTER TABLE `medecins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `medecins_utilisateur_id_foreign` (`utilisateur_id`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Index pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Index pour la table `rendez_vous`
--
ALTER TABLE `rendez_vous`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rendez_vous_malade_id_foreign` (`patient_id`),
  ADD KEY `rendez_vous_medecin_id_foreign` (`doctor_id`);

--
-- Index pour la table `rendez_vous_images`
--
ALTER TABLE `rendez_vous_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rendez_vous_images_rendez_vous_id_foreign` (`rendez_vous_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `consultations`
--
ALTER TABLE `consultations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `dossier_medicals`
--
ALTER TABLE `dossier_medicals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `dossier_medical_attachments`
--
ALTER TABLE `dossier_medical_attachments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `malades`
--
ALTER TABLE `malades`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `medecins`
--
ALTER TABLE `medecins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `rendez_vous`
--
ALTER TABLE `rendez_vous`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `rendez_vous_images`
--
ALTER TABLE `rendez_vous_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `consultations`
--
ALTER TABLE `consultations`
  ADD CONSTRAINT `consultations_malade_id_foreign` FOREIGN KEY (`malade_id`) REFERENCES `malades` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `consultations_medecin_id_foreign` FOREIGN KEY (`medecin_id`) REFERENCES `medecins` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `consultations_rendez_vous_id_foreign` FOREIGN KEY (`rendez_vous_id`) REFERENCES `rendez_vous` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `dossier_medicals`
--
ALTER TABLE `dossier_medicals`
  ADD CONSTRAINT `dossier_medicals_malade_id_foreign` FOREIGN KEY (`malade_id`) REFERENCES `malades` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `dossier_medicals_medecin_id_foreign` FOREIGN KEY (`medecin_id`) REFERENCES `medecins` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `dossier_medical_attachments`
--
ALTER TABLE `dossier_medical_attachments`
  ADD CONSTRAINT `dossier_medical_attachments_dossier_medical_id_foreign` FOREIGN KEY (`dossier_medical_id`) REFERENCES `dossier_medicals` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `malades`
--
ALTER TABLE `malades`
  ADD CONSTRAINT `malades_utilisateur_id_foreign` FOREIGN KEY (`utilisateur_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `medecins`
--
ALTER TABLE `medecins`
  ADD CONSTRAINT `medecins_utilisateur_id_foreign` FOREIGN KEY (`utilisateur_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `rendez_vous`
--
ALTER TABLE `rendez_vous`
  ADD CONSTRAINT `rendez_vous_malade_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `malades` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rendez_vous_medecin_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `medecins` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `rendez_vous_images`
--
ALTER TABLE `rendez_vous_images`
  ADD CONSTRAINT `rendez_vous_images_rendez_vous_id_foreign` FOREIGN KEY (`rendez_vous_id`) REFERENCES `rendez_vous` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
