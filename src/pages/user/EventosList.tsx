import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '../../contexts/UserContext';
import { Evento, Enxoval } from '../../models/interfaces';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';
import { formatarData } from '../../utils/formatters';

// Styled components para a página de eventos
const EventoContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--soft-shadow);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const EventoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const EventoTitle = styled.h2`
  color: var(--medium-blue);
  font-size: 1.5rem;
  margin: 0;
`;

const EventoDate = styled.span`
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
`;

const EventoLocal = styled.p`
  margin: 0.5rem 0;
  color: var(--text-primary);
`;

const EnxovalSection = styled.div`
  margin-top: 1.5rem;
  background-color: var(--light-background);
  padding: 1rem;
  border-radius: 6px;
`;

const EnxovalTitle = styled.h3`
  color: var(--dark-blue);
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
`;

const EnxovalList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EnxovalCard = styled.div`
  padding: 1rem;
  background-color: white;
  border-radius: 6px;
  border-left: 4px solid var(--baby-blue);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EnxovalInfo = styled.div`
  flex: 1;
`;

const EnxovalName = styled.h4`
  margin: 0 0 0.5rem 0;
  color: var(--dark-blue);
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  background-color: var(--light-background);
  border-radius: 8px;
  margin-top: 1rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const EventosList: React.FC = () => {
  const { eventos, eventosLoading, getEventos, enxovais, enxovaisLoading, getEnxovaisByEvento } = useUser();
  const navigate = useNavigate();
  const [expandedEventos, setExpandedEventos] = useState<{[key: number]: boolean}>({});
  
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        await getEventos();
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      }
    };
    
    fetchEventos();
  }, [getEventos]);
  
  // Função para alternar a exibição dos enxovais de um evento
  const toggleEvento = async (eventoId: number) => {
    // Se o evento ainda não foi expandido e não estamos carregando enxovais
    if (!expandedEventos[eventoId] && !enxovaisLoading) {
      try {
        // Buscar enxovais para este evento
        await getEnxovaisByEvento(eventoId);
      } catch (error) {
        console.error(`Erro ao buscar enxovais para o evento ${eventoId}:`, error);
      }
    }
    
    // Atualizar o estado de expansão
    setExpandedEventos(prev => ({
      ...prev,
      [eventoId]: !prev[eventoId]
    }));
  };
  
  // Navegar para a página de detalhes do enxoval
  const handleEnxovalClick = (eventoId: number, enxovalId: number) => {
    navigate(`/eventos/${eventoId}/enxovais/${enxovalId}`);
  };

  // Voltar para a página anterior
  const handleVoltar = () => {
    navigate('/');
  };
  
  // Filtrar apenas eventos futuros (data maior que a data atual)
  const eventosFuturos = eventos.filter(evento => {
    const dataEvento = evento.dataHora instanceof Date 
      ? evento.dataHora 
      : new Date(evento.dataHora);
    return dataEvento > new Date();
  });
  
  // Ordenar eventos por data (mais próximos primeiro)
  const eventosOrdenados = [...eventosFuturos].sort((a, b) => {
    const dataA = a.dataHora instanceof Date ? a.dataHora : new Date(a.dataHora);
    const dataB = b.dataHora instanceof Date ? b.dataHora : new Date(b.dataHora);
    return dataA.getTime() - dataB.getTime();
  });
  
  // Renderizar enxovais de um evento
  const renderEnxovais = (evento: Evento) => {
    const enxovaisDoEvento = enxovais.filter(enxoval => enxoval.idEvento === evento.id);
    
    if (enxovaisLoading) {
      return <LoadingMessage>Carregando enxovais...</LoadingMessage>;
    }
    
    if (enxovaisDoEvento.length === 0) {
      return <EmptyMessage>Nenhum enxoval disponível para este evento.</EmptyMessage>;
    }
    
    return (
      <EnxovalList>
        {enxovaisDoEvento.map(enxoval => (
          <EnxovalCard key={enxoval.id}>
            <EnxovalInfo>
              <EnxovalName>{enxoval.nome}</EnxovalName>
            </EnxovalInfo>
            <Button 
              $size="small" 
              onClick={() => handleEnxovalClick(evento.id as number, enxoval.id as number)}
            >
              Ver Itens
            </Button>
          </EnxovalCard>
        ))}
      </EnxovalList>
    );
  };
  
  return (
    <PageLayout title="Eventos Disponíveis">
      <PageHeader>
        <Button onClick={handleVoltar} $variant="secondary" $size="small">
          ← Voltar
        </Button>
      </PageHeader>
      
      {eventosLoading ? (
        <LoadingMessage>Carregando eventos...</LoadingMessage>
      ) : eventosOrdenados.length === 0 ? (
        <EmptyMessage>
          Nenhum evento futuro disponível no momento. Por favor, volte mais tarde.
        </EmptyMessage>
      ) : (
        eventosOrdenados.map(evento => (
          <EventoContainer key={evento.id}>
            <EventoHeader>
              <EventoTitle>{evento.nome}</EventoTitle>
              <EventoDate>
                {formatarData(evento.dataHora instanceof Date ? evento.dataHora : new Date(evento.dataHora))}
              </EventoDate>
            </EventoHeader>
            <EventoLocal>Local: {evento.local}</EventoLocal>
            
            <Button 
              $variant="secondary" 
              onClick={() => toggleEvento(evento.id as number)}
              $fullWidth
            >
              {expandedEventos[evento.id as number] ? 'Ocultar Enxovais' : 'Ver Enxovais Disponíveis'}
            </Button>
            
            {expandedEventos[evento.id as number] && (
              <EnxovalSection>
                <EnxovalTitle>Enxovais Disponíveis</EnxovalTitle>
                {renderEnxovais(evento)}
              </EnxovalSection>
            )}
          </EventoContainer>
        ))
      )}
    </PageLayout>
  );
};

export default EventosList; 