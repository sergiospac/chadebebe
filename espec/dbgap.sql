-- Script do banco de dados dbgap:

-- artelo69_dbgap.Evento definition

CREATE TABLE `Evento` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `dataHora` datetime DEFAULT NULL,
  `local` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- artelo69_dbgap.TipoItem definition

CREATE TABLE `TipoItem` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `imagem` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- artelo69_dbgap.Usuario definition

CREATE TABLE `Usuario` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `senha` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `tel` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `adm` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- artelo69_dbgap.Enxoval definition

CREATE TABLE `Enxoval` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `idEvento` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Evento_Enxoval_FK` (`idEvento`),
  CONSTRAINT `Evento_Enxoval_FK` FOREIGN KEY (`idEvento`) REFERENCES `Evento` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- artelo69_dbgap.ItemEnxoval definition

CREATE TABLE `ItemEnxoval` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `qtdDisponivel` int(11) NOT NULL,
  `idEnxoval` int(10) unsigned NOT NULL,
  `idTipoItem` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Enxoval_ItemEnxoval_FK` (`idEnxoval`),
  KEY `TipoItem_ItemEnxoval_FK` (`idTipoItem`),
  CONSTRAINT `Enxoval_ItemEnxoval_FK` FOREIGN KEY (`idEnxoval`) REFERENCES `Enxoval` (`id`),
  CONSTRAINT `TipoItem_ItemEnxoval_FK` FOREIGN KEY (`idTipoItem`) REFERENCES `TipoItem` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- artelo69_dbgap.Doacao definition

CREATE TABLE `Doacao` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `qtd` int(10) unsigned NOT NULL,
  `situacao` int(10) unsigned NOT NULL,
  `data` date DEFAULT NULL,
  `idUsuario` int(10) unsigned NOT NULL,
  `idItemEnxoval` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Usuario_Doacao_FK` (`idUsuario`),
  KEY `ItemEnxoval_Doacao_FK` (`idItemEnxoval`),
  CONSTRAINT `ItemEnxoval_Doacao_FK` FOREIGN KEY (`idItemEnxoval`) REFERENCES `ItemEnxoval` (`id`),
  CONSTRAINT `Usuario_Doacao_FK` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

