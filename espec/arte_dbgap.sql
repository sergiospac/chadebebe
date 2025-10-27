-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Tempo de geração: 26/10/2025 às 13:48
-- Versão do servidor: 10.11.14-MariaDB-ubu2404
-- Versão do PHP: 8.3.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `arte_dbgap`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `Doacao`
--

CREATE TABLE `Doacao` (
  `id` int(10) UNSIGNED NOT NULL,
  `qtd` int(10) UNSIGNED NOT NULL,
  `situacao` int(10) UNSIGNED NOT NULL,
  `data` date DEFAULT NULL,
  `idUsuario` int(10) UNSIGNED NOT NULL,
  `idItemEnxoval` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `Enxoval`
--

CREATE TABLE `Enxoval` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(128) DEFAULT NULL,
  `idEvento` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `Evento`
--

CREATE TABLE `Evento` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(128) NOT NULL,
  `dataHora` datetime DEFAULT NULL,
  `local` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `ItemEnxoval`
--

CREATE TABLE `ItemEnxoval` (
  `id` int(10) UNSIGNED NOT NULL,
  `qtdDisponivel` int(11) NOT NULL,
  `idEnxoval` int(10) UNSIGNED NOT NULL,
  `idTipoItem` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `TipoItem`
--

CREATE TABLE `TipoItem` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(32) NOT NULL,
  `imagem` varchar(256) DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Despejando dados para a tabela `TipoItem`
--

INSERT INTO `TipoItem` (`id`, `nome`, `imagem`, `ativo`) VALUES
(1, 'Babador', NULL, 0),
(2, 'Banho de sol', NULL, 0),
(3, 'Blusa de manga curta', NULL, 0),
(4, 'Body', NULL, 0),
(5, 'Bolsa', NULL, 0),
(6, 'Caixa de cotonetes', NULL, 0),
(7, 'Camiseta e Short', NULL, 0),
(8, 'Camisetinha', NULL, 0),
(9, 'Casaquinho', NULL, 0),
(10, 'Cobertor', NULL, 0),
(11, 'Conjunto pagão', NULL, 0),
(12, 'Culote', NULL, 0),
(13, 'Escovinha de cabelo', NULL, 0),
(14, 'Gorro', NULL, 0),
(15, 'Hipoglós', NULL, 0),
(16, 'Lenço umedecido', NULL, 0),
(17, 'Lençol e fronha', NULL, 0),
(18, 'Macacão comprido', NULL, 0),
(19, 'Macacão curto', NULL, 0),
(20, 'Manta', NULL, 0),
(21, 'Meinhas', NULL, 0),
(22, 'Pacote de Algodão', NULL, 0),
(23, 'Pacote de cueiro', NULL, 0),
(24, 'Pacote de fraldas de pano', NULL, 0),
(25, 'Pacote de fraldas descartável', NULL, 0),
(26, 'Pano de boca', NULL, 0),
(27, 'Pijama de flanela', NULL, 0),
(28, 'Sabonete para bebê', NULL, 0),
(29, 'Sapatinho', NULL, 0),
(30, 'Termômetro', NULL, 0),
(31, 'Toalha', NULL, 0),
(32, 'Travesseiro', NULL, 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `Usuario`
--

CREATE TABLE `Usuario` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(128) NOT NULL,
  `email` varchar(128) NOT NULL,
  `senha` varchar(128) DEFAULT NULL,
  `tel` varchar(16) NOT NULL,
  `adm` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Despejando dados para a tabela `Usuario`
--

INSERT INTO `Usuario` (`id`, `nome`, `email`, `senha`, `tel`, `adm`) VALUES
(1, 'Administrador', 'admin@gap.org', '$2b$12$dEVhBRub7kVqj7Dgx8ssZOHy4lkA9DY1MexQKJux73yM30hk.NUKi', '(00) 00000-0000', 1),
(2, 'Usuário Teste', 'usuario@gap.org', '$2b$12$LXBsWXyG8Cl7j.BKygxfjOSyQF507T.YJa7ec0G29QQfXll8GGAl2', '(00) 00000-0000', 0);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `Doacao`
--
ALTER TABLE `Doacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Usuario_Doacao_FK` (`idUsuario`),
  ADD KEY `ItemEnxoval_Doacao_FK` (`idItemEnxoval`);

--
-- Índices de tabela `Enxoval`
--
ALTER TABLE `Enxoval`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Evento_Enxoval_FK` (`idEvento`);

--
-- Índices de tabela `Evento`
--
ALTER TABLE `Evento`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `ItemEnxoval`
--
ALTER TABLE `ItemEnxoval`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Enxoval_ItemEnxoval_FK` (`idEnxoval`),
  ADD KEY `TipoItem_ItemEnxoval_FK` (`idTipoItem`);

--
-- Índices de tabela `TipoItem`
--
ALTER TABLE `TipoItem`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `Usuario`
--
ALTER TABLE `Usuario`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `Doacao`
--
ALTER TABLE `Doacao`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `Enxoval`
--
ALTER TABLE `Enxoval`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `Evento`
--
ALTER TABLE `Evento`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `ItemEnxoval`
--
ALTER TABLE `ItemEnxoval`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `TipoItem`
--
ALTER TABLE `TipoItem`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de tabela `Usuario`
--
ALTER TABLE `Usuario`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `Doacao`
--
ALTER TABLE `Doacao`
  ADD CONSTRAINT `ItemEnxoval_Doacao_FK` FOREIGN KEY (`idItemEnxoval`) REFERENCES `ItemEnxoval` (`id`),
  ADD CONSTRAINT `Usuario_Doacao_FK` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario` (`id`);

--
-- Restrições para tabelas `Enxoval`
--
ALTER TABLE `Enxoval`
  ADD CONSTRAINT `Evento_Enxoval_FK` FOREIGN KEY (`idEvento`) REFERENCES `Evento` (`id`);

--
-- Restrições para tabelas `ItemEnxoval`
--
ALTER TABLE `ItemEnxoval`
  ADD CONSTRAINT `Enxoval_ItemEnxoval_FK` FOREIGN KEY (`idEnxoval`) REFERENCES `Enxoval` (`id`),
  ADD CONSTRAINT `TipoItem_ItemEnxoval_FK` FOREIGN KEY (`idTipoItem`) REFERENCES `TipoItem` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
