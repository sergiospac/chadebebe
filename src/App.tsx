import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import PageLayout from './components/layout/PageLayout';
import { useAuth } from './contexts/AuthContext';

// Páginas de autenticação
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Páginas de usuário comum
import EventosList from './pages/user/EventosList';
import EnxovalDetail from './pages/user/EnxovalDetail';
import DoacoesList from './pages/user/DoacoesList';

// Páginas de administrador
import AdminDashboard from './pages/admin/AdminDashboard';

// Estilos para o card
const CardStyle = {
  padding: '1.5rem',
  borderRadius: '8px',
  width: '280px',
  boxShadow: 'var(--soft-shadow)',
  textAlign: 'center' as const,
  cursor: 'pointer',
  transition: 'transform 0.3s, box-shadow 0.3s',
  textDecoration: 'none',
  color: 'var(--text-primary)',
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '180px'
};

// Estilos para o ícone
const IconStyle = {
  fontSize: '2.5rem',
  marginBottom: '1rem'
};

const HomeContent = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate('/login');
  };

  if (usuario) {
    // Conteúdo para usuário logado
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <h1 style={{ marginBottom: '1rem', color: 'var(--medium-blue)' }}>
          Bem-vindo ao Sistema Chadebebe, {usuario.nome}!
        </h1>
        <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
          Este sistema foi desenvolvido para gerenciar doações de enxovais para bebês.
          Selecione uma das opções abaixo para começar.
        </p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1.5rem',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          {/* Card para Eventos */}
          <Link to="/eventos" style={{
            ...CardStyle,
            backgroundColor: 'var(--baby-blue)',
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--soft-shadow)';
          }}>
            <div style={IconStyle}>📅</div>
            <h3>Eventos</h3>
            <p>Veja os próximos eventos de doação e os enxovais disponíveis</p>
          </Link>
          
          {/* Card para Doações */}
          <Link to="/minhas-doacoes" style={{
            ...CardStyle,
            backgroundColor: 'var(--baby-pink)',
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--soft-shadow)';
          }}>
            <div style={IconStyle}>🎁</div>
            <h3>Minhas Doações</h3>
            <p>Acompanhe o histórico de suas doações e status</p>
          </Link>
          
          {/* Card para informações do sistema */}
          <Link to="/" style={{
            ...CardStyle,
            backgroundColor: 'var(--baby-green)',
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--soft-shadow)';
          }}>
            <div style={IconStyle}>ℹ️</div>
            <h3>Sobre o Sistema</h3>
            <p>Saiba mais sobre o projeto Chadebebe e como funciona</p>
          </Link>
        </div>
      </div>
    );
  }

  // Conteúdo para usuário não logado
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '2rem', 
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ marginBottom: '1rem', color: 'var(--medium-blue)' }}>
        Bem-vindo ao Sistema Chadebebe
      </h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
        Este sistema foi desenvolvido para gerenciar doações de enxovais para bebês.
        Faça login para acessar todas as funcionalidades.
      </p>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '1rem',
        flexWrap: 'wrap',
        marginBottom: '2rem'
      }}>
        <div 
          onClick={redirectToLogin}
          style={{ 
            ...CardStyle,
            backgroundColor: 'var(--baby-pink)', 
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--soft-shadow)';
          }}
        >
          <div style={IconStyle}>🎁</div>
          <h3>Doações</h3>
          <p>Faça sua doação para um de nossos eventos</p>
        </div>
        <div 
          onClick={redirectToLogin}
          style={{ 
            ...CardStyle,
            backgroundColor: 'var(--baby-blue)', 
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--soft-shadow)';
          }}
        >
          <div style={IconStyle}>📅</div>
          <h3>Eventos</h3>
          <p>Veja os próximos eventos de doação</p>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link 
          to="/login" 
          style={{
            display: 'inline-block',
            padding: '0.8rem 2rem',
            backgroundColor: 'var(--medium-blue)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--dark-blue)'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--medium-blue)'}
        >
          Entrar no Sistema
        </Link>
      </div>
    </div>
  );
};

const Home = () => {
  const { usuario } = useAuth();

  if (usuario) {
    return (
      <PageLayout title="Início">
        <HomeContent />
      </PageLayout>
    );
  }

  return <HomeContent />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <UserProvider>
            <GlobalStyles />
            <Routes>
              {/* Rotas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/registrar" element={<Register />} />
              <Route path="/" element={<Home />} />
              
              {/* Rotas protegidas para usuários comuns */}
              <Route 
                path="/eventos" 
                element={
                  <ProtectedRoute>
                    <EventosList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/eventos/:eventoId/enxovais/:enxovalId" 
                element={
                  <ProtectedRoute>
                    <EnxovalDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/minhas-doacoes" 
                element={
                  <ProtectedRoute>
                    <DoacoesList />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rotas protegidas para administradores */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirecionar qualquer rota desconhecida para a home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </UserProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 