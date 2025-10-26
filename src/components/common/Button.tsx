import React, { ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: 'primary' | 'secondary' | 'success' | 'danger';
  $fullWidth?: boolean;
  $size?: 'small' | 'medium' | 'large';
}

const getButtonColor = (variant?: string) => {
  switch (variant) {
    case 'primary':
      return css`
        background: radial-gradient(#2196F3, #00BCD4);
        color: yellow;
      `;
    case 'secondary':
      return css`
        background: radial-gradient(#9C27B0, #673AB7);
        color: white;
      `;
    case 'success':
      return css`
        background: radial-gradient(#4CAF50, #8BC34A);
        color: white;
      `;
    case 'danger':
      return css`
        background: radial-gradient(#F44336, #FF5722);
        color: white;
      `;
    default:
      return css`
        background: radial-gradient(#2196F3, #00BCD4);
        color: yellow;
      `;
  }
};

const getButtonSize = (size?: string) => {
  switch (size) {
    case 'small':
      return css`
        padding: 8px 16px;
        font-size: 0.85em;
      `;
    case 'large':
      return css`
        padding: 16px 32px;
        font-size: 1.2em;
      `;
    default:
      return css`
        padding: 14px 24px;
        font-size: 1em;
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  border: none;
  border-radius: 12px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 10px;
  box-shadow: var(--medium-shadow);
  
  ${({ $variant }) => getButtonColor($variant)}
  ${({ $size }) => getButtonSize($size)}
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Button: React.FC<ButtonProps> = ({ 
  children, 
  $variant = 'primary', 
  $fullWidth = false, 
  $size = 'medium',
  ...rest 
}) => {
  return (
    <StyledButton 
      $variant={$variant} 
      $fullWidth={$fullWidth} 
      $size={$size}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 