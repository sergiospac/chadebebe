import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Container from '../../components/common/Container';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';

const Form = styled.form`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const LinkContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const ErrorMessage = styled.div`
  color: #ff0033;
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  background-color: rgba(255, 0, 51, 0.1);
  border-radius: 8px;
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !senha) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const success = await login(email, senha);
      
      if (success) {
        const usuario = JSON.parse(localStorage.getItem('@Chadebebe:usuario') || '{}');
        navigate(usuario.adm ? '/admin' : '/');
      } else {
        setError('Email ou senha incorretos');
      }
    } catch (err) {
      setError('Ocorreu um erro ao fazer login. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container title="Login">
      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Seu email"
        />
        
        <FormField
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          placeholder="Sua senha"
        />
        
        <Button 
          type="submit" 
          $fullWidth 
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
        
        <LinkContainer>
          <p>Não tem uma conta? <Link to="/registrar">Registre-se</Link></p>
        </LinkContainer>
      </Form>
    </Container>
  );
};

export default Login; 