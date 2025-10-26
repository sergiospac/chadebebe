import React from 'react';
import styled from 'styled-components';

interface ContainerProps {
  children: React.ReactNode;
  title?: string;
}

const StyledContainer = styled.div`
  max-width: 800px;
  margin: 20px;
  padding: 30px;
  background: rgba(192, 255, 192, 0.95);
  border-radius: 24px;
  box-shadow: var(--soft-shadow);
  position: relative;
  backdrop-filter: blur(10px);
  max-height: 90vh;
  overflow-y: auto;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-family: 'Quicksand', sans-serif;
  color: var(--medium-blue);
  font-size: 2.5em;
  margin: 0;
  text-align: center;
`;

const Subtitle = styled.h2`
  font-family: 'Quicksand', sans-serif;
  color: var(--medium-blue);
  text-align: center;
  font-size: 1.8em;
  margin-bottom: 1.5em;
`;

const Container: React.FC<ContainerProps> = ({ children, title }) => {
  return (
    <StyledContainer>
      <Logo>
        <Title>Chadebebe</Title>
        <div>Sistema de Doação de Enxoval de Bebês</div>
      </Logo>
      
      {title && <Subtitle>{title}</Subtitle>}
      
      {children}
    </StyledContainer>
  );
};

export default Container; 