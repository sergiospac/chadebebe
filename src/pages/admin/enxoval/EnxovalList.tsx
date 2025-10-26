import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAdmin } from '../../../contexts/AdminContext';
import Container from '../../../components/common/Container';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import { Enxoval } from '../../../models/interfaces';
import EnxovalForm from './EnxovalForm';
import EnxovalItemList from './EnxovalItemList';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #343a40;
`;

const ActionButton = styled(Button)`
  margin-left: 0.5rem;
`;

const EnxovalList: React.FC = () => {
  const { enxovais, loadingEnxovais, getEnxovais, deleteEnxoval } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Enxoval | null>(null);
  const [selectedEnxoval, setSelectedEnxoval] = useState<Enxoval | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad) {
      getEnxovais();
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  const handleAddClick = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditClick = (item: Enxoval) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteClick = async (item: Enxoval) => {
    if (!item.id) return;
    
    if (window.confirm(`Tem certeza que deseja excluir o enxoval "${item.nome}"?`)) {
      try {
        await deleteEnxoval(item.id);
        alert('Enxoval excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir enxoval:', error);
        alert('Erro ao excluir enxoval. Tente novamente.');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
    setIsInitialLoad(true);
  };

  const handleManageItems = (item: Enxoval) => {
    setSelectedEnxoval(item);
  };

  const handleBackToList = () => {
    setSelectedEnxoval(null);
  };

  const columns = [
    { header: 'ID', accessor: 'id' as keyof Enxoval },
    { header: 'Nome', accessor: 'nome' as keyof Enxoval },
    { 
      header: 'Evento', 
      accessor: (item: Enxoval) => item.evento ? item.evento.nome : 'Evento não encontrado'
    }
  ];

  // Se um enxoval estiver selecionado, mostrar a lista de itens desse enxoval
  if (selectedEnxoval) {
    return (
      <EnxovalItemList 
        enxoval={selectedEnxoval} 
        onBack={handleBackToList} 
      />
    );
  }

  return (
    <Container>
      <PageHeader>
        <Title>Gerenciamento de Enxovais</Title>
        <Button onClick={handleAddClick} $variant="primary">
          Adicionar Novo Enxoval
        </Button>
      </PageHeader>

      <Table 
        columns={columns}
        data={enxovais}
        loading={loadingEnxovais}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {showForm && (
        <EnxovalForm 
          item={editingItem} 
          onClose={handleFormClose} 
        />
      )}

      {/* Botões adicionais para cada linha */}
      {enxovais.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Ações Adicionais</h3>
          <p>Para gerenciar os itens de um enxoval, clique no botão abaixo:</p>
          
          {enxovais.map(enxoval => (
            <div key={enxoval.id} style={{ marginBottom: '0.5rem' }}>
              <strong>{enxoval.nome}</strong> ({enxoval.evento?.nome || 'Evento não encontrado'})
              <ActionButton 
                onClick={() => handleManageItems(enxoval)} 
                $variant="secondary"
                $size="small"
              >
                Gerenciar Itens
              </ActionButton>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default EnxovalList; 