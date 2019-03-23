-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le :  ven. 22 mars 2019 à 21:23
-- Version du serveur :  10.1.28-MariaDB
-- Version de PHP :  5.6.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `quiznan`
--

-- --------------------------------------------------------

--
-- Structure de la table `entrer`
--

CREATE TABLE `entrer` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `response_id` int(11) DEFAULT NULL,
  `student_id` int(11) NOT NULL,
  `register` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `langage`
--

CREATE TABLE `langage` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `moyenne`
--

CREATE TABLE `moyenne` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `souscategorie_id` int(11) NOT NULL,
  `note` float NOT NULL,
  `register_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `errors` int(11) NOT NULL,
  `time` int(11) NOT NULL,
  `etat` int(11) NOT NULL,
  `trouve` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `question`
--

CREATE TABLE `question` (
  `id` int(11) NOT NULL,
  `content` text NOT NULL,
  `files` varchar(255) DEFAULT NULL,
  `register_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `SousCate` int(11) NOT NULL,
  `crypt` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `quiz`
--

CREATE TABLE `quiz` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `beg` datetime DEFAULT NULL,
  `end` datetime DEFAULT NULL,
  `status` int(11) NOT NULL,
  `description` text,
  `register` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `encrypt` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `quiz`
--

INSERT INTO `quiz` (`id`, `title`, `beg`, `end`, `status`, `description`, `register`, `encrypt`) VALUES
(1, 'HTML-CSS-JS', '2019-03-01 23:33:49', '2019-03-27 23:33:49', 1, 'TEST', '2019-02-19 22:19:41', 'aqwzsxedcrfvtgbyhnuj'),
(2, 'PYTHON', '2019-04-01 23:33:49', '2019-04-30 23:33:57', 1, 'Azsxcer', '2019-02-19 23:34:52', 'qdcedf527mk25');

-- --------------------------------------------------------

--
-- Structure de la table `response`
--

CREATE TABLE `response` (
  `id` int(11) NOT NULL,
  `content` varchar(255) NOT NULL,
  `question_Id` int(11) NOT NULL,
  `register_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `files` varchar(200) DEFAULT NULL,
  `ele` int(11) NOT NULL DEFAULT '0',
  `crypt` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `souscateg`
--

CREATE TABLE `souscateg` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `quizNaN_id` int(11) NOT NULL,
  `end` datetime DEFAULT NULL,
  `beg` datetime DEFAULT NULL,
  `register` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `crypt` varchar(255) NOT NULL,
  `times` int(11) DEFAULT NULL,
  `moyen` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `student`
--

CREATE TABLE `student` (
  `id` int(11) NOT NULL,
  `pseudo` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `login` datetime DEFAULT NULL,
  `register` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `emailcrypt` varchar(255) NOT NULL,
  `level` int(11) NOT NULL DEFAULT '0',
  `keyform` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `student`
--

INSERT INTO `student` (`id`, `pseudo`, `email`, `pass`, `login`, `register`, `emailcrypt`, `level`, `keyform`) VALUES
(1, 'Icore', 'core.irie@gmail.com', 'cc7b555a56ef4e4dea39c6f376474aa5bcb24232590e85d8db1014a42da78800', '2019-03-06 11:41:48', '2019-02-18 11:59:04', 'akjfaekjvbzbvzegvuyzbvuvv', 0, '635365464653'),
(3, 'Keffa', 'keffa@gmail.com', 'cc7b555a56ef4e4dea39c6f376474aa5bcb24232590e85d8db1014a42da78800', NULL, '2019-02-18 12:04:26', 'jaehgfkjagzhevieuazgfuiezbgfuizejbv', 1, '35436546463'),
(4, 'Fleury', 'fleur@gmail.com', 'cc7b555a56ef4e4dea39c6f376474aa5bcb24232590e85d8db1014a42da78800', '2019-02-23 03:08:28', '2019-02-20 00:42:36', 'amlfze5fzrf5z8fzr5fzre', 0, '666645555554'),
(5, 'Besta', 'bes@gmail.com', 'cc7b555a56ef4e4dea39c6f376474aa5bcb24232590e85d8db1014a42da78800', '2019-02-23 03:18:44', '2019-02-20 00:43:39', 'azadefezvzeveveveveve', 0, '3543565363'),
(6, 'Habib', 'az@gmail.com', 'cc7b555a56ef4e4dea39c6f376474aa5bcb24232590e85d8db1014a42da78800', '2019-02-25 17:23:55', '2019-02-20 00:44:13', 'acfzvfrzvjkenrjvermve', 0, '25444542522'),
(9, 'FT 2J', 'ft@gmail.com', 'cc7b555a56ef4e4dea39c6f376474aa5bcb24232590e85d8db1014a42da78800', '2019-02-23 03:58:53', '2019-02-20 00:45:48', '53d4fv5sv2ssfs', 0, '63868686855');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `entrer`
--
ALTER TABLE `entrer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Question_id` (`question_id`),
  ADD KEY `response_id` (`response_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Index pour la table `langage`
--
ALTER TABLE `langage`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `moyenne`
--
ALTER TABLE `moyenne`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `souscategorie_id` (`souscategorie_id`);

--
-- Index pour la table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD KEY `SousCate` (`SousCate`);

--
-- Index pour la table `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `response`
--
ALTER TABLE `response`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_Id` (`question_Id`);

--
-- Index pour la table `souscateg`
--
ALTER TABLE `souscateg`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quizNaN_id` (`quizNaN_id`);

--
-- Index pour la table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `entrer`
--
ALTER TABLE `entrer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `langage`
--
ALTER TABLE `langage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `moyenne`
--
ALTER TABLE `moyenne`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `question`
--
ALTER TABLE `question`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `response`
--
ALTER TABLE `response`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `souscateg`
--
ALTER TABLE `souscateg`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `student`
--
ALTER TABLE `student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `entrer`
--
ALTER TABLE `entrer`
  ADD CONSTRAINT `FK_entrer_response` FOREIGN KEY (`response_id`) REFERENCES `response` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `entrer_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `entrer_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `moyenne`
--
ALTER TABLE `moyenne`
  ADD CONSTRAINT `FK_moyenne_souscateg` FOREIGN KEY (`souscategorie_id`) REFERENCES `souscateg` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_moyenne_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `question_ibfk_2` FOREIGN KEY (`SousCate`) REFERENCES `souscateg` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `response`
--
ALTER TABLE `response`
  ADD CONSTRAINT `FK_response_question` FOREIGN KEY (`question_Id`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `souscateg`
--
ALTER TABLE `souscateg`
  ADD CONSTRAINT `souscateg_ibfk_1` FOREIGN KEY (`quizNaN_id`) REFERENCES `quiz` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
