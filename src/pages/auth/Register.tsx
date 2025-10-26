import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Container from '../../components/common/Container';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Usuario } from '../../models/interfaces';

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

const Register: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { registrar } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !email || !tel || !senha || !confirmarSenha) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const novoUsuario: Usuario = {
        nome,
        email,
        senha,
        tel,
        adm: false // Todos os novos usuários são comuns por padrão
      };
      
      const success = await registrar(novoUsuario);
      
      if (success) {
        navigate('/');
      } else {
        setError('Este email já está em uso ou ocorreu um erro no cadastro');
      }
    } catch (err) {
      setError('Ocorreu um erro ao registrar. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container title="Registrar">
      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <FormField
          label="Nome Completo"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          placeholder="Seu nome completo"
        />
        
        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Seu email"
        />
        
        <FormField
          label="Telefone"
          type="tel"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
          required
          placeholder="(00) 00000-0000"
        />
        
        <FormField
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          placeholder="Crie uma senha"
        />
        
        <FormField
          label="Confirmar Senha"
          type="password"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
          placeholder="Confirme sua senha"
        />
        
        <Button 
          type="submit" 
          $fullWidth 
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrar'}
        </Button>
        
        <LinkContainer>
          <p>Já tem uma conta? <Link to="/login">Faça login</Link></p>
        </LinkContainer>
      </Form>
    </Container>
  );
};

export default Register; 