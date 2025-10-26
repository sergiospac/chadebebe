import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAdmin } from '../../../contexts/AdminContext';
import Container from '../../../components/common/Container';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import { Enxoval, ItemEnxoval } from '../../../models/interfaces';
import EnxovalItemForm from './EnxovalItemForm';

interface EnxovalItemListProps {
  enxoval: Enxoval;
  onBack: () => void;
}

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

const Subtitle = styled.h2`
  font-size: 1.25rem;
  color: #6c757d;
  margin-bottom: 1rem;
`;

const BackButton = styled(Button)`
  margin-right: 0.5rem;
`;

const EnxovalItemList: React.FC<EnxovalItemListProps> = ({ enxoval, onBack }) => {
  const { 
    loadingItensEnxoval, 
    getItensEnxovalByEnxoval, 
    deleteItemEnxoval,
    tiposItem,
    getTiposItem
  } = useAdmin();
  
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemEnxoval | null>(null);
  const [filteredItems, setFilteredItems] = useState<ItemEnxoval[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad || enxoval.id) {
      const loadData = async () => {
        if (tiposItem.length === 0) {
          await getTiposItem();
        }
        const items = await getItensEnxovalByEnxoval(enxoval.id || 0);
        setFilteredItems(items);
        setIsInitialLoad(false);
      };
      
      loadData();
    }
  }, [enxoval.id, isInitialLoad, tiposItem.length]);

  const handleAddClick = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditClick = (item: ItemEnxoval) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteClick = async (item: ItemEnxoval) => {
    if (!item.id) return;
    
    if (window.confirm(`Tem certeza que deseja excluir este item do enxoval?`)) {
      try {
        await deleteItemEnxoval(item.id);
        alert('Item excluído com sucesso!');
        // Recarregar a lista
        const items = await getItensEnxovalByEnxoval(enxoval.id || 0);
        setFilteredItems(items);
      } catch (error) {
        console.error('Erro ao excluir item:', error);
        alert('Erro ao excluir item. Tente novamente.');
      }
    }
  };

  const handleFormClose = async () => {
    setShowForm(false);
    setEditingItem(null);
    // Recarregar a lista
    setIsInitialLoad(true);
  };

  const columns = [
    { 
      header: 'Tipo de Item', 
      accessor: (item: ItemEnxoval) => item.tipoItem ? item.tipoItem.nome : 'Tipo não encontrado'
    },
    { 
      header: 'Imagem', 
      accessor: (item: ItemEnxoval) => item.tipoItem?.imagem ? (
        <img 
          src={item.tipoItem.imagem} 
          alt={item.tipoItem.nome} 
          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
        />
      ) : 'Sem imagem'
    },
    { header: 'Quantidade Disponível', accessor: 'qtdDisponivel' as keyof ItemEnxoval }
  ];

  return (
    <Container>
      <PageHeader>
        <div>
          <BackButton onClick={onBack} $variant="secondary">
            ← Voltar para Enxovais
          </BackButton>
          <Title>Gerenciamento de Itens do Enxoval</Title>
          <Subtitle>{enxoval.nome} - {enxoval.evento?.nome}</Subtitle>
        </div>
        <Button onClick={handleAddClick} $variant="primary">
          Adicionar Novo Item
        </Button>
      </PageHeader>

      <Table 
        columns={columns}
        data={filteredItems}
        loading={loadingItensEnxoval}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {showForm && (
        <EnxovalItemForm 
          item={editingItem} 
          enxoval={enxoval}
          tiposItem={tiposItem}
          onClose={handleFormClose} 
        />
      )}
    </Container>
  );
};

export default EnxovalItemList; 