import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const Header = styled.header`
  background-color: var(--medium-blue);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--soft-shadow);
`;

const Title = styled.h1`
  color: white;
  margin: 0;
  font-size: 1.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
`;

const LogoutButton = styled.button`
  background-color: transparent;
  border: 2px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: white;
    color: var(--medium-blue);
  }
`;

const Content = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title }) => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <Header>
        <Title>{title}</Title>
        <UserInfo>
          <span>Olá, {usuario?.nome}</span>
          <LogoutButton onClick={handleLogout}>
            Sair
          </LogoutButton>
        </UserInfo>
      </Header>
      <Content>
        {children}
      </Content>
    </>
  );
};

export default PageLayout; 