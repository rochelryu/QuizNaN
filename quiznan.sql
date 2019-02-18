-- --------------------------------------------------------
-- Hôte :                        localhost
-- Version du serveur:           5.7.19 - MySQL Community Server (GPL)
-- SE du serveur:                Win64
-- HeidiSQL Version:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Export de la structure de la base pour quiznan
CREATE DATABASE IF NOT EXISTS `quiznan` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `quiznan`;

-- Export de la structure de la table quiznan. entrer
CREATE TABLE IF NOT EXISTS `entrer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Question_id` int(11) NOT NULL,
  `response_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `register` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `Question_id` (`Question_id`),
  KEY `response_id` (`response_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `entrer_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `entrer_ibfk_2` FOREIGN KEY (`Question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `entrer_ibfk_3` FOREIGN KEY (`response_id`) REFERENCES `response` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Export de données de la table quiznan.entrer : ~0 rows (environ)
DELETE FROM `entrer`;
/*!40000 ALTER TABLE `entrer` DISABLE KEYS */;
/*!40000 ALTER TABLE `entrer` ENABLE KEYS */;

-- Export de la structure de la table quiznan. note
CREATE TABLE IF NOT EXISTS `note` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `SousQuiz_id` int(11) NOT NULL,
  `students_id` int(11) NOT NULL,
  `Note` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `SousQuiz_id` (`SousQuiz_id`),
  KEY `students_id` (`students_id`),
  CONSTRAINT `note_ibfk_1` FOREIGN KEY (`students_id`) REFERENCES `student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Export de données de la table quiznan.note : ~0 rows (environ)
DELETE FROM `note`;
/*!40000 ALTER TABLE `note` DISABLE KEYS */;
/*!40000 ALTER TABLE `note` ENABLE KEYS */;

-- Export de la structure de la table quiznan. question
CREATE TABLE IF NOT EXISTS `question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `files` varchar(255) DEFAULT NULL,
  `register_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `SousCate` int(11) NOT NULL,
  `crypt` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `SousCate` (`SousCate`),
  CONSTRAINT `question_ibfk_1` FOREIGN KEY (`id`) REFERENCES `response` (`question_Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `question_ibfk_2` FOREIGN KEY (`SousCate`) REFERENCES `souscateg` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Export de données de la table quiznan.question : ~0 rows (environ)
DELETE FROM `question`;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
/*!40000 ALTER TABLE `question` ENABLE KEYS */;

-- Export de la structure de la table quiznan. quiz
CREATE TABLE IF NOT EXISTS `quiz` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `time` int(11) NOT NULL,
  `beg` datetime DEFAULT NULL,
  `end` datetime DEFAULT NULL,
  `status` int(11) NOT NULL,
  `description` text,
  `register` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `encrypt` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Export de données de la table quiznan.quiz : ~0 rows (environ)
DELETE FROM `quiz`;
/*!40000 ALTER TABLE `quiz` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz` ENABLE KEYS */;

-- Export de la structure de la table quiznan. response
CREATE TABLE IF NOT EXISTS `response` (
  `id` int(11) NOT NULL,
  `content` varchar(255) NOT NULL,
  `question_Id` int(11) NOT NULL,
  `register_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `files` varchar(200) DEFAULT NULL,
  `ele` int(11) NOT NULL DEFAULT '0',
  `crypt` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `question_Id` (`question_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Export de données de la table quiznan.response : ~0 rows (environ)
DELETE FROM `response`;
/*!40000 ALTER TABLE `response` DISABLE KEYS */;
/*!40000 ALTER TABLE `response` ENABLE KEYS */;

-- Export de la structure de la table quiznan. souscateg
CREATE TABLE IF NOT EXISTS `souscateg` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tiltle` varchar(255) NOT NULL,
  `quizNaN_id` int(11) NOT NULL,
  `end` datetime DEFAULT NULL,
  `beg` datetime DEFAULT NULL,
  `register` int(11) NOT NULL,
  `crypt` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `quizNaN_id` (`quizNaN_id`),
  CONSTRAINT `souscateg_ibfk_1` FOREIGN KEY (`quizNaN_id`) REFERENCES `quiz` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Export de données de la table quiznan.souscateg : ~0 rows (environ)
DELETE FROM `souscateg`;
/*!40000 ALTER TABLE `souscateg` DISABLE KEYS */;
/*!40000 ALTER TABLE `souscateg` ENABLE KEYS */;

-- Export de la structure de la table quiznan. student
CREATE TABLE IF NOT EXISTS `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pseudo` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `login` datetime DEFAULT NULL,
  `register` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `emailcrypt` varchar(255) NOT NULL,
  `level` int(11) NOT NULL DEFAULT '0',
  `keyform` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Export de données de la table quiznan.student : ~1 rows (environ)
DELETE FROM `student`;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` (`id`, `pseudo`, `email`, `pass`, `login`, `register`, `emailcrypt`, `level`, `keyform`) VALUES
	(1, 'Icore', 'core.irie@gmail.com', 'cc7b555a56ef4e4dea39c6f376474aa5bcb24232590e85d8db1014a42da78800', NULL, '2019-02-18 11:59:04', 'akjfaekjvbzbvzegvuyzbvuvv', 0, '635365464653'),
	(3, 'Keffa', 'keffa@gmail.com', 'cc7b555a56ef4e4dea39c6f376474aa5bcb24232590e85d8db1014a42da78800', NULL, '2019-02-18 12:04:26', 'jaehgfkjagzhevieuazgfuiezbgfuizejbv', 0, '35436546463');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
