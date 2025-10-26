import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAdmin } from '../../../contexts/AdminContext';
import Container from '../../../components/common/Container';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import { Evento } from '../../../models/interfaces';
import EventoForm from './EventoForm';

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

const EventoList: React.FC = () => {
  const { eventos, loadingEventos, getEventos, deleteEvento } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Evento | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad) {
      getEventos();
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  const handleAddClick = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditClick = (item: Evento) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteClick = async (item: Evento) => {
    if (!item.id) return;
    
    if (window.confirm(`Tem certeza que deseja excluir o evento "${item.nome}"?`)) {
      try {
        await deleteEvento(item.id);
        alert('Evento excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir evento:', error);
        alert('Erro ao excluir evento. Tente novamente.');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
    setIsInitialLoad(true);
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    { header: 'ID', accessor: 'id' as keyof Evento },
    { header: 'Nome', accessor: 'nome' as keyof Evento },
    { 
      header: 'Data e Hora', 
      accessor: (item: Evento) => formatDate(item.dataHora)
    },
    { header: 'Local', accessor: 'local' as keyof Evento }
  ];

  return (
    <Container>
      <PageHeader>
        <Title>Gerenciamento de Eventos</Title>
        <Button onClick={handleAddClick} $variant="primary">
          Adicionar Novo Evento
        </Button>
      </PageHeader>

      <Table 
        columns={columns}
        data={eventos}
        loading={loadingEventos}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {showForm && (
        <EventoForm 
          item={editingItem} 
          onClose={handleFormClose} 
        />
      )}
    </Container>
  );
};

export default EventoList; 