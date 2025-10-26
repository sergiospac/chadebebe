import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '../../contexts/UserContext';
import { ItemEnxoval, TipoItem } from '../../models/interfaces';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';

// Styled components para a página de detalhes do enxoval
const EnxovalHeader = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: var(--light-background);
  border-radius: 8px;
`;

const EnxovalTitle = styled.h2`
  color: var(--dark-blue);
  margin-bottom: 0.5rem;
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ItemCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--soft-shadow);
  overflow: hidden;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const ItemImage = styled.div<{ $imageUrl?: string }>`
  height: 180px;
  background-color: var(--light-background);
  background-image: ${({ $imageUrl }) => $imageUrl ? `url(${$imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ItemImagePlaceholder = styled.div`
  width: 80px;
  height: 80px;
  background-color: var(--baby-blue);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
`;

const ItemContent = styled.div`
  padding: 1rem;
`;

const ItemName = styled.h3`
  color: var(--dark-blue);
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
`;

const ItemQuantity = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
`;

const QuantityLabel = styled.span`
  color: var(--text-secondary);
  margin-right: 0.5rem;
`;

const QuantityValue = styled.span`
  font-weight: 600;
  color: var(--text-primary);
`;

const QuantityInput = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background-color: var(--light-background);
  color: var(--text-primary);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  
  &:hover {
    background-color: var(--baby-blue);
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityNumber = styled.span`
  width: 40px;
  text-align: center;
  font-weight: 600;
  margin: 0 0.5rem;
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
`;

const SuccessMessage = styled.div`
  background-color: var(--success-light);
  color: var(--success-dark);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
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

const EnxovalDetail: React.FC = () => {
  const { eventoId, enxovalId } = useParams<{ eventoId: string, enxovalId: string }>();
  const navigate = useNavigate();
  const { enxovais, itensEnxoval, itensEnxovalLoading, getEnxovaisByEvento, getItensEnxovalByEnxoval, fazerDoacao } = useUser();
  
  // Estado para controlar a quantidade de cada item
  const [quantidades, setQuantidades] = useState<Record<number, number>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  // Carregar dados ao montar o componente
  useEffect(() => {
    const loadData = async () => {
      if (eventoId) {
        await getEnxovaisByEvento(Number(eventoId));
      }
      
      if (enxovalId) {
        await getItensEnxovalByEnxoval(Number(enxovalId));
      }
    };
    
    loadData();
  }, [eventoId, enxovalId, getEnxovaisByEvento, getItensEnxovalByEnxoval]);
  
  // Encontrar o enxoval atual
  const enxovalAtual = enxovais.find(enxoval => enxoval.id === Number(enxovalId));
  
  // Incrementar a quantidade de um item
  const incrementarQuantidade = (itemId: number, maxQuantidade: number) => {
    setQuantidades(prev => {
      const quantidadeAtual = prev[itemId] || 0;
      if (quantidadeAtual < maxQuantidade) {
        return { ...prev, [itemId]: quantidadeAtual + 1 };
      }
      return prev;
    });
  };
  
  // Decrementar a quantidade de um item
  const decrementarQuantidade = (itemId: number) => {
    setQuantidades(prev => {
      const quantidadeAtual = prev[itemId] || 0;
      if (quantidadeAtual > 0) {
        return { ...prev, [itemId]: quantidadeAtual - 1 };
      }
      return prev;
    });
  };
  
  // Realizar a doação
  const realizarDoacao = async (itemId: number, quantidade: number) => {
    if (quantidade <= 0) return;
    
    const sucesso = await fazerDoacao(itemId, quantidade);
    
    if (sucesso) {
      // Limpar a quantidade deste item
      setQuantidades(prev => ({ ...prev, [itemId]: 0 }));
      
      // Mostrar mensagem de sucesso
      setSuccessMessage('Doação realizada com sucesso! Obrigado pela sua contribuição.');
      
      // Limpar a mensagem após alguns segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      // Recarregar os itens do enxoval para atualizar as quantidades
      if (enxovalId) {
        await getItensEnxovalByEnxoval(Number(enxovalId));
      }
    }
  };
  
  // Voltar para a lista de eventos
  const voltarParaEventos = () => {
    navigate('/eventos');
  };
  
  if (itensEnxovalLoading) {
    return (
      <PageLayout title="Detalhes do Enxoval">
        <LoadingMessage>Carregando itens do enxoval...</LoadingMessage>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title="Detalhes do Enxoval">
      <PageHeader>
        <Button onClick={voltarParaEventos} $variant="secondary" $size="small">
          ← Voltar
        </Button>
      </PageHeader>
      
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      
      <EnxovalHeader>
        <EnxovalTitle>{enxovalAtual?.nome || 'Enxoval'}</EnxovalTitle>
      </EnxovalHeader>
      
      {itensEnxoval.length === 0 ? (
        <EmptyMessage>
          Não há itens disponíveis neste enxoval no momento.
        </EmptyMessage>
      ) : (
        <ItemsGrid>
          {itensEnxoval.map(item => {
            const tipoItem = item.tipoItem as TipoItem;
            const quantidadeAtual = quantidades[item.id as number] || 0;
            
            return (
              <ItemCard key={item.id} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto', padding: '5px 5px'}}>
                <ItemImage style={{width: '100%',  margin: 'auto auto'}} $imageUrl={tipoItem?.imagem}>
                  {!tipoItem?.imagem && (
                    <ItemImagePlaceholder>
                      {tipoItem?.nome.charAt(0).toUpperCase()}
                    </ItemImagePlaceholder>
                  )}
                </ItemImage>
                <ItemContent>
                  <ItemName>{tipoItem?.nome}</ItemName>
                  <ItemQuantity>
                    <QuantityLabel>Disponível:</QuantityLabel>
                    <QuantityValue>{item.qtdDisponivel}</QuantityValue>
                  </ItemQuantity>
                  
                  <QuantityInput>
                    <QuantityButton 
                      onClick={() => decrementarQuantidade(item.id as number)}
                      disabled={quantidadeAtual <= 0}
                    >
                      -
                    </QuantityButton>
                    <QuantityNumber>{quantidadeAtual}</QuantityNumber>
                    <QuantityButton 
                      onClick={() => incrementarQuantidade(item.id as number, item.qtdDisponivel)}
                      disabled={quantidadeAtual >= item.qtdDisponivel}
                    >
                      +
                    </QuantityButton>
                  </QuantityInput>
                  
                  <Button 
                    $variant="success" 
                    $fullWidth 
                    onClick={() => realizarDoacao(item.id as number, quantidadeAtual)}
                    disabled={quantidadeAtual <= 0}
                    style={{ marginTop: '1rem' }}
                  >
                    Doar
                  </Button>
                </ItemContent>
              </ItemCard>
            );
          })}
        </ItemsGrid>
      )}
    </PageLayout>
  );
};

export default EnxovalDetail; 