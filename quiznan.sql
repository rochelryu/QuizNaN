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
  `question_id` int(11) NOT NULL,
  `response_id` int(11) DEFAULT NULL,
  `student_id` int(11) NOT NULL,
  `register` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `Question_id` (`question_id`),
  KEY `response_id` (`response_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `FK_entrer_response` FOREIGN KEY (`response_id`) REFERENCES `response` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `entrer_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `entrer_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Export de données de la table quiznan.entrer : ~0 rows (environ)
DELETE FROM `entrer`;
/*!40000 ALTER TABLE `entrer` DISABLE KEYS */;
INSERT INTO `entrer` (`id`, `question_id`, `response_id`, `student_id`, `register`) VALUES
	(1, 3, 2, 1, '2019-02-22 16:36:51'),
	(2, 5, 11, 1, '2019-02-22 16:37:06'),
	(3, 6, 14, 1, '2019-02-22 16:38:07');
/*!40000 ALTER TABLE `entrer` ENABLE KEYS */;

-- Export de la structure de la table quiznan. moyenne
CREATE TABLE IF NOT EXISTS `moyenne` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `souscategorie_id` int(11) NOT NULL,
  `note` float NOT NULL,
  `register_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `souscategorie_id` (`souscategorie_id`),
  CONSTRAINT `FK_moyenne_souscateg` FOREIGN KEY (`souscategorie_id`) REFERENCES `souscateg` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_moyenne_student` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Export de données de la table quiznan.moyenne : ~0 rows (environ)
DELETE FROM `moyenne`;
/*!40000 ALTER TABLE `moyenne` DISABLE KEYS */;
/*!40000 ALTER TABLE `moyenne` ENABLE KEYS */;

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
  CONSTRAINT `question_ibfk_2` FOREIGN KEY (`SousCate`) REFERENCES `souscateg` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- Export de données de la table quiznan.question : ~5 rows (environ)
DELETE FROM `question`;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` (`id`, `content`, `files`, `register_date`, `SousCate`, `crypt`) VALUES
	(2, 'Qu\'est ce que HTML ?', NULL, '2019-02-19 22:25:11', 1, 'azassz'),
	(3, 'Qu\'est ce CSS ?', NULL, '2019-02-19 22:27:30', 2, 'asxdaedez'),
	(4, 'Qu\'est ce que Js ?', NULL, '2019-02-19 22:28:17', 3, 'aefzxxeze'),
	(5, 'quel est la position d\'une balise DIV', NULL, '2019-02-19 22:29:09', 2, 'zrcczrcrfaeazd'),
	(6, 'Qu\'est-ce que De tel', NULL, '2019-02-19 22:50:42', 2, '272727sfgsg');
/*!40000 ALTER TABLE `question` ENABLE KEYS */;

-- Export de la structure de la table quiznan. quiz
CREATE TABLE IF NOT EXISTS `quiz` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `beg` datetime DEFAULT NULL,
  `end` datetime DEFAULT NULL,
  `status` int(11) NOT NULL,
  `description` text,
  `register` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `encrypt` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Export de données de la table quiznan.quiz : ~2 rows (environ)
DELETE FROM `quiz`;
/*!40000 ALTER TABLE `quiz` DISABLE KEYS */;
INSERT INTO `quiz` (`id`, `title`, `beg`, `end`, `status`, `description`, `register`, `encrypt`) VALUES
	(1, 'HTML-CSS-JS', '2019-02-19 22:13:55', '2019-02-26 00:19:02', 1, 'TEST', '2019-02-19 22:19:41', 'aqwzsxedcrfvtgbyhnuj'),
	(2, 'PYTHON', '2019-03-19 23:33:49', '2019-03-30 23:33:57', 0, 'Azsxcer', '2019-02-19 23:34:52', 'qdcedf527mk25');
/*!40000 ALTER TABLE `quiz` ENABLE KEYS */;

-- Export de la structure de la table quiznan. response
CREATE TABLE IF NOT EXISTS `response` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) NOT NULL,
  `question_Id` int(11) NOT NULL,
  `register_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `files` varchar(200) DEFAULT NULL,
  `ele` int(11) NOT NULL DEFAULT '0',
  `crypt` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `question_Id` (`question_Id`),
  CONSTRAINT `FK_response_question` FOREIGN KEY (`question_Id`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- Export de données de la table quiznan.response : ~14 rows (environ)
DELETE FROM `response`;
/*!40000 ALTER TABLE `response` DISABLE KEYS */;
INSERT INTO `response` (`id`, `content`, `question_Id`, `register_date`, `files`, `ele`, `crypt`) VALUES
	(1, 'kjgjh hjvkgkvghjkj', 3, '2019-02-19 23:06:00', NULL, 0, 'jlyfkutycytyhcgh'),
	(2, 'garzart jgvkjh jhvkkkkkkkj jh jh jhgvhg h gh hg hg ghk g h gh g gv gh hgv hg hg hg hg hg h ,gv ,hjvhjvh j g ', 3, '2019-02-19 23:07:17', NULL, 1, '63656341651hghg'),
	(3, 'argh fdxhgd gfdxh fgfh dfd fddjf g  gfx fnbx bn cfbc fnc nfc nbc nb cnb', 3, '2019-02-19 23:09:58', NULL, 0, '544757rr'),
	(4, 'thhh jhvk khvhkgv hjg hgv gh h hg hgj v gg', 2, '2019-02-19 23:10:40', NULL, 1, 'tyyjfy58'),
	(5, 'qsddn hgjvh ghvgf gfcrfrg', 2, '2019-02-19 23:11:19', NULL, 0, 'zazrezg'),
	(6, 'azaedzefzfzfzz fvcz evfeer e everv ezvrev', 4, '2019-02-19 23:15:22', NULL, 0, '6666aa5s5d6'),
	(7, 'adacazh zhjb uz hubzuz zuey ezvvcj z uvjhkbvvb ucbv hcvcukv jhbvhdukdds ', 4, '2019-02-19 23:16:26', NULL, 0, 'adfaelfjaevjk'),
	(8, '5q343qc43zrf3zfzf3z5 z54vz z5v4z 54vz5 5z 45z3ev4z53  z54vz5vz z  zev  z  ?', 4, '2019-02-19 23:18:11', NULL, 0, 'aefzgfzrgegzn'),
	(9, 'aifaegbb izu biz bzeivz zbiu buv bizu bzi bz i vbzev zivbe ervbe eervjh e eiuveri ', 4, '2019-02-19 23:23:23', NULL, 0, 'aufgyeufyf685f6fz63zvze'),
	(10, 'aezfjkabfik dkjhdbidi jdh iud dijb idf idfub df uidf buf', 4, '2019-02-19 23:24:27', NULL, 1, 'adkafa2258'),
	(11, 'GET /Assets/font/roboto/Roboto-Regular.woff 404 0.825 ms - 177', 5, '2019-02-19 23:27:01', NULL, 1, 'auygaed'),
	(12, 'GET /ownL/zjhcvzjhcvjzzrfzrjhfvbzuhfburehvbfuerbfuebvue 302 25.106 ms - 60', 5, '2019-02-19 23:27:26', NULL, 0, '5356sevsv'),
	(13, 'GET /Assets/font/roboto/Roboto-Light.ttf 404 0.817 ms - 174', 6, '2019-02-19 23:30:33', NULL, 0, 'aqqcqdcdsc25'),
	(14, '[nodemon] restarting due to changes...', 6, '2019-02-19 23:32:09', NULL, 1, '25zc5zc5zc');
/*!40000 ALTER TABLE `response` ENABLE KEYS */;

-- Export de la structure de la table quiznan. souscateg
CREATE TABLE IF NOT EXISTS `souscateg` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `quizNaN_id` int(11) NOT NULL,
  `end` datetime DEFAULT NULL,
  `beg` datetime DEFAULT NULL,
  `register` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `crypt` varchar(255) NOT NULL,
  `times` int(11) DEFAULT NULL,
  `moyen` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quizNaN_id` (`quizNaN_id`),
  CONSTRAINT `souscateg_ibfk_1` FOREIGN KEY (`quizNaN_id`) REFERENCES `quiz` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Export de données de la table quiznan.souscateg : ~3 rows (environ)
DELETE FROM `souscateg`;
/*!40000 ALTER TABLE `souscateg` DISABLE KEYS */;
INSERT INTO `souscateg` (`id`, `title`, `quizNaN_id`, `end`, `beg`, `register`, `crypt`, `times`, `moyen`) VALUES
	(1, 'HTML', 1, '2019-02-21 22:20:02', '2019-02-19 22:20:10', '2019-02-19 22:20:32', 'azerty', 1, 70),
	(2, 'CSS', 1, '2019-02-24 22:22:19', '2019-02-22 22:22:37', '2019-02-19 22:23:12', '8366688655ff', 3, 65),
	(3, 'JS', 1, '2019-02-26 22:23:37', '2019-02-24 22:23:29', '2019-02-19 22:23:58', '5755753776757z575rf7fzfz', 1, 75);
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- Export de données de la table quiznan.student : ~6 rows (environ)
DELETE FROM `student`;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` (`id`, `pseudo`, `email`, `pass`, `login`, `register`, `emailcrypt`, `level`, `keyform`) VALUES
	(1, 'Icore', 'core.irie@gmail.com', 'cc7b555a56ef4e4dea39c6f376474aa5bcb24232590e85d8db1014a42da78800', '2019-02-22 16:36:13', '2019-02-18 11:59:04', 'akjfaekjvbzbvzegvuyzbvuvv', 0, '635365464653'),
	(3, 'Keffa', 'keffa@gmail.com', 'cc7b555a56ef4e4dea39c6f376474aa5bcb24232590e85d8db1014a42da78800', NULL, '2019-02-18 12:04:26', 'jaehgfkjagzhevieuazgfuiezbgfuizejbv', 1, '35436546463'),
	(4, 'Fleury', 'fleur@gmail.com', 'cc7b555a56ef4e4dea39c6f376474aa5bcb24232590e85d8db1014a42da78800', '2019-02-22 01:26:22', '2019-02-20 00:42:36', 'amlfze5fzrf5z8fzr5fzre', 0, '666645555554'),
	(5, 'Besta', 'bes@gmail.com', 'cc7b555a56ef4e4dea39c6f376474aa5bcb24232590e85d8db1014a42da78800', '2019-02-22 01:27:33', '2019-02-20 00:43:39', 'azadefezvzeveveveveve', 0, '3543565363'),
	(6, 'Habib', 'az@gmail.com', 'cc7b555a56ef4e4dea39c6f376474aa5bcb24232590e85d8db1014a42da78800', '2019-02-22 01:26:02', '2019-02-20 00:44:13', 'acfzvfrzvjkenrjvermve', 0, '25444542522'),
	(9, 'FT 2J', 'ft@gmail.com', 'cc7b555a56ef4e4dea39c6f376474aa5bcb24232590e85d8db1014a42da78800', '2019-02-22 01:25:26', '2019-02-20 00:45:48', '53d4fv5sv2ssfs', 0, '63868686855');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
