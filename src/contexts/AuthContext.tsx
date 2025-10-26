import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContextData, Usuario } from '../models/interfaces';
import { RepositoryFactory } from '../services/repository/RepositoryFactory';

// Criação do contexto com valor inicial padrão
const AuthContext = createContext<AuthContextData>({
  usuario: null,
  loading: true,
  login: async () => false,
  logout: () => {},
  registrar: async () => false
});

// Hook personalizado para facilitar o uso do contexto
export const useAuth = () => useContext(AuthContext);

// Interface para as propriedades do provider
interface AuthProviderProps {
  children: React.ReactNode;
}

// Provider do contexto de autenticação
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('@Chadebebe:usuario');
    
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  // Função para realizar login
  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      setLoading(true);
      const usuarioRepository = RepositoryFactory.createUsuarioRepository();
      const usuarioAutenticado = await usuarioRepository.authenticate(email, senha);
      
      if (usuarioAutenticado) {
        setUsuario(usuarioAutenticado);
        localStorage.setItem('@Chadebebe:usuario', JSON.stringify(usuarioAutenticado));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função para fazer logout
  const logout = (): void => {
    setUsuario(null);
    localStorage.removeItem('@Chadebebe:usuario');
  };

  // Função para registrar novo usuário
  const registrar = async (novoUsuario: Usuario): Promise<boolean> => {
    try {
      setLoading(true);
      const usuarioRepository = RepositoryFactory.createUsuarioRepository();
      
      // Verificar se já existe usuário com este email
      const usuarioExistente = await usuarioRepository.findByEmail(novoUsuario.email);
      
      if (usuarioExistente) {
        return false;
      }
      
      // Todos os novos usuários são comuns por padrão
      const usuarioCriado = await usuarioRepository.create({
        ...novoUsuario,
        adm: false
      });
      
      if (usuarioCriado) {
        // Omitir senha do objeto armazenado no estado
        const { senha: _, ...usuarioSemSenha } = usuarioCriado;
        setUsuario(usuarioSemSenha as Usuario);
        localStorage.setItem('@Chadebebe:usuario', JSON.stringify(usuarioSemSenha));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, login, logout, registrar }}>
      {children}
    </AuthContext.Provider>
  );
}; 