import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAdmin } from '../../../contexts/AdminContext';
import Container from '../../../components/common/Container';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import { TipoItem } from '../../../models/interfaces';
import TipoItemForm from './TipoItemForm';

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

const TipoItemList: React.FC = () => {
  const { tiposItem, loadingTiposItem, getTiposItem, deleteTipoItem } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<TipoItem | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad) {
      getTiposItem();
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  const handleAddClick = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditClick = (item: TipoItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteClick = async (item: TipoItem) => {
    if (!item.id) return;
    
    if (window.confirm(`Tem certeza que deseja excluir o tipo de item "${item.nome}"?`)) {
      try {
        await deleteTipoItem(item.id);
        alert('Tipo de item excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir tipo de item:', error);
        alert('Erro ao excluir tipo de item. Tente novamente.');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
    setIsInitialLoad(true);
  };

  const columns = [
    { header: 'ID', accessor: 'id' as keyof TipoItem },
    { header: 'Nome', accessor: 'nome' as keyof TipoItem },
    { 
      header: 'Imagem', 
      accessor: (item: TipoItem) => item.imagem ? (
        <img 
          src={item.imagem} 
          alt={item.nome} 
          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
        />
      ) : 'Sem imagem'
    },
    { 
      header: 'Status', 
      accessor: (item: TipoItem) => (
        <span style={{ 
          color: item.ativo ? '#28a745' : '#dc3545',
          fontWeight: 'bold'
        }}>
          {item.ativo ? 'Ativo' : 'Inativo'}
        </span>
      )
    }
  ];

  return (
    <Container>
      <PageHeader>
        <Title>Gerenciamento de Tipos de Itens</Title>
        <Button onClick={handleAddClick} $variant="primary">
          Adicionar Novo Tipo
        </Button>
      </PageHeader>

      <Table 
        columns={columns}
        data={tiposItem}
        loading={loadingTiposItem}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {showForm && (
        <TipoItemForm 
          item={editingItem} 
          onClose={handleFormClose} 
        />
      )}
    </Container>
  );
};

export default TipoItemList; 