import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useUser } from '../../contexts/UserContext';
import { SituacaoDoacao, Doacao } from '../../models/interfaces';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';
import { formatarData, formatarStatusDoacao } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

// Styled components para a página de doações
const DoacaoContainer = styled.div`
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--soft-shadow);
`;

const DoacaoHeader = styled.div`
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

const DoacaoTitle = styled.h3`
  color: var(--dark-blue);
  margin: 0;
`;

const DoacaoDate = styled.span`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const DoacaoInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  flex: 1;
  min-width: 200px;
`;

const InfoLabel = styled.span`
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.span`
  display: block;
  font-weight: 500;
  color: var(--text-primary);
`;

const StatusBadge = styled.span<{ $status: number }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  
  ${({ $status }) => {
    switch ($status) {
      case SituacaoDoacao.PENDENTE:
        return `
          background-color: var(--warning-light);
          color: var(--warning-dark);
        `;
      case SituacaoDoacao.CONFIRMADA:
        return `
          background-color: var(--info-light);
          color: var(--info-dark);
        `;
      case SituacaoDoacao.ENTREGUE:
        return `
          background-color: var(--success-light);
          color: var(--success-dark);
        `;
      case SituacaoDoacao.CANCELADA:
        return `
          background-color: var(--danger-light);
          color: var(--danger-dark);
        `;
      default:
        return `
          background-color: var(--light-background);
          color: var(--text-secondary);
        `;
    }
  }}
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
  margin-bottom: 1.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
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

// Modal para edição
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: var(--medium-shadow);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: var(--dark-blue);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
`;

const DoacoesList: React.FC = () => {
  const { doacoesUsuario, doacoesLoading, getDoacoesByUsuario, cancelarDoacao, fazerDoacao } = useUser();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDoacao, setCurrentDoacao] = useState<Doacao | null>(null);
  const [quantidade, setQuantidade] = useState(0);
  
  // Carregar doações ao montar o componente
  useEffect(() => {
    getDoacoesByUsuario();
  }, [getDoacoesByUsuario]);
  
  // Cancelar uma doação
  const handleCancelarDoacao = async (doacaoId: number) => {
    const confirmacao = window.confirm('Tem certeza que deseja cancelar esta doação?');
    
    if (confirmacao) {
      await cancelarDoacao(doacaoId);
    }
  };

  // Editar uma doação
  const handleEditarDoacao = (doacao: Doacao) => {
    setCurrentDoacao(doacao);
    setQuantidade(doacao.qtd);
    setShowEditModal(true);
  };

  // Fechar modal de edição
  const handleCloseModal = () => {
    setShowEditModal(false);
    setCurrentDoacao(null);
  };

  // Salvar edição de doação
  const handleSaveEdit = async () => {
    if (currentDoacao && quantidade > 0) {
      try {
        // Cancelar a doação antiga
        await cancelarDoacao(currentDoacao.id as number);
        
        // Criar uma nova doação com a quantidade atualizada
        await fazerDoacao(currentDoacao.idItemEnxoval, quantidade);
        
        setShowEditModal(false);
        setCurrentDoacao(null);
        
        // Atualizar a lista
        await getDoacoesByUsuario();
        
        alert('Doação atualizada com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar doação:', error);
        alert('Erro ao atualizar doação. Tente novamente.');
      }
    }
  };

  // Redirecionar para a lista de eventos para fazer uma nova doação
  const handleNovaDoacao = () => {
    navigate('/eventos');
  };

  // Voltar para a página anterior
  const handleVoltar = () => {
    navigate('/');
  };
  
  // Ordenar doações por data (mais recentes primeiro)
  const doacoesOrdenadas = [...doacoesUsuario].sort((a, b) => {
    const dataA = a.data instanceof Date ? a.data : new Date(a.data);
    const dataB = b.data instanceof Date ? b.data : new Date(b.data);
    return dataB.getTime() - dataA.getTime();
  });
  
  return (
    <PageLayout title="Minhas Doações">
      <PageHeader>
        <Button onClick={handleVoltar} $variant="secondary" $size="small">
          ← Voltar
        </Button>
        <Button onClick={handleNovaDoacao} $variant="primary">
          Nova Doação
        </Button>
      </PageHeader>
      
      {doacoesLoading ? (
        <LoadingMessage>Carregando suas doações...</LoadingMessage>
      ) : doacoesOrdenadas.length === 0 ? (
        <>
          <EmptyMessage>
            Você ainda não realizou nenhuma doação. Que tal começar agora?
          </EmptyMessage>
          <ButtonContainer>
            <Button $variant="primary" $fullWidth onClick={handleNovaDoacao}>
              Fazer minha primeira doação
            </Button>
          </ButtonContainer>
        </>
      ) : (
        doacoesOrdenadas.map(doacao => {
          const itemEnxoval = doacao.itemEnxoval;
          const tipoItem = itemEnxoval?.tipoItem;
          const enxoval = itemEnxoval?.enxoval;
          
          return (
            <DoacaoContainer key={doacao.id}>
              <DoacaoHeader>
                <DoacaoTitle>
                  {tipoItem?.nome || 'Item'} - {enxoval?.nome || 'Enxoval'}
                </DoacaoTitle>
                <DoacaoDate>
                  {formatarData(doacao.data instanceof Date ? doacao.data : new Date(doacao.data))}
                </DoacaoDate>
              </DoacaoHeader>
              
              <DoacaoInfo>
                <InfoItem>
                  <InfoLabel>Quantidade:</InfoLabel>
                  <InfoValue>{doacao.qtd}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Status:</InfoLabel>
                  <StatusBadge $status={doacao.situacao}>
                    {formatarStatusDoacao(doacao.situacao)}
                  </StatusBadge>
                </InfoItem>
              </DoacaoInfo>
              
              <ActionButtons>
                {doacao.situacao === SituacaoDoacao.PENDENTE && (
                  <>
                    <Button 
                      $variant="success" 
                      $size="small"
                      onClick={() => handleEditarDoacao(doacao)}
                    >
                      ✏️ Editar
                    </Button>
                    <Button 
                      $variant="danger" 
                      $size="small"
                      onClick={() => handleCancelarDoacao(doacao.id as number)}
                    >
                      🗑️ Cancelar
                    </Button>
                  </>
                )}
              </ActionButtons>
            </DoacaoContainer>
          );
        })
      )}

      {showEditModal && currentDoacao && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Editar Doação</ModalTitle>
              <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <Label>Item:</Label>
              <Input 
                type="text" 
                value={currentDoacao.itemEnxoval?.tipoItem?.nome || 'Item'} 
                disabled 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Quantidade:</Label>
              <Input 
                type="number" 
                value={quantidade} 
                onChange={(e) => setQuantidade(parseInt(e.target.value) || 0)} 
                min="1" 
              />
            </FormGroup>
            
            <ButtonContainer>
              <Button $variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button 
                $variant="primary" 
                onClick={handleSaveEdit}
                disabled={quantidade <= 0}
              >
                Salvar
              </Button>
            </ButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageLayout>
  );
};

export default DoacoesList; 