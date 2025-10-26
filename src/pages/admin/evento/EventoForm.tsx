import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAdmin } from '../../../contexts/AdminContext';
import FormField from '../../../components/common/FormField';
import Button from '../../../components/common/Button';
import { Evento } from '../../../models/interfaces';

interface EventoFormProps {
  item: Evento | null;
  onClose: () => void;
}

const FormContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const FormTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: #343a40;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const EventoForm: React.FC<EventoFormProps> = ({ item, onClose }) => {
  const { createEvento, updateEvento } = useAdmin();
  const [formData, setFormData] = useState<Evento & { dataHora: string }>({
    nome: '',
    dataHora: new Date().toISOString().slice(0, 16), // Formato YYYY-MM-DDTHH:MM
    local: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      // Converter a data para o formato esperado pelo input datetime-local
      let dataHoraStr: string;
      if (typeof item.dataHora === 'string') {
        const date = new Date(item.dataHora);
        dataHoraStr = date.toISOString().slice(0, 16); // Formato YYYY-MM-DDTHH:MM
      } else {
        dataHoraStr = item.dataHora.toISOString().slice(0, 16);
      }
      
      setFormData({
        ...item,
        dataHora: dataHoraStr
      });
    }
  }, [item]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome é obrigatório';
    }
    
    if (!formData.dataHora) {
      newErrors.dataHora = 'A data e hora são obrigatórias';
    }
    
    if (!formData.local.trim()) {
      newErrors.local = 'O local é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      // Converter a data para o formato ISO
      const eventoData: Evento = {
        ...formData,
        dataHora: new Date(formData.dataHora).toISOString()
      };
      
      if (item && item.id) {
        await updateEvento(item.id, eventoData);
        alert('Evento atualizado com sucesso!');
      } else {
        await createEvento(eventoData);
        alert('Evento criado com sucesso!');
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      alert('Erro ao salvar evento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>{item ? 'Editar Evento' : 'Adicionar Novo Evento'}</FormTitle>
      
      <form onSubmit={handleSubmit}>
        <FormRow>
          <FormField
            label="Nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            error={errors.nome}
            required
          />
        </FormRow>
        
        <FormRow>
          <FormField
            label="Data e Hora"
            name="dataHora"
            type="datetime-local"
            value={formData.dataHora}
            onChange={handleChange}
            error={errors.dataHora}
            required
          />
        </FormRow>
        
        <FormRow>
          <FormField
            label="Local"
            name="local"
            value={formData.local}
            onChange={handleChange}
            error={errors.local}
            required
          />
        </FormRow>
        
        <ButtonGroup>
          <Button 
            type="button" 
            onClick={onClose} 
            $variant="secondary"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            $variant="primary"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default EventoForm; 