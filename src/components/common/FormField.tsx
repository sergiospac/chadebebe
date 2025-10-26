import React, { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  type?: string;
}

const FormGroup = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

const Label = styled.label`
  font-family: 'Quicksand', sans-serif;
  color: #666;
  margin-bottom: 8px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid var(--baby-blue);
  border-radius: 12px;
  font-family: 'Open Sans', sans-serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--medium-blue);
    box-shadow: 0 0 0 3px rgba(127, 181, 255, 0.2);
  }
`;

const ErrorMessage = styled.div`
  color: #ff0033;
  font-size: 0.85rem;
  margin-top: 5px;
`;

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  error, 
  type = 'text',
  ...rest 
}) => {
  return (
    <FormGroup>
      <Label>{label}</Label>
      <Input type={type} {...rest} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormGroup>
  );
};

export default FormField; 