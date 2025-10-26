import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAdmin } from '../../../contexts/AdminContext';
import FormField from '../../../components/common/FormField';
import Button from '../../../components/common/Button';
import { Enxoval } from '../../../models/interfaces';

interface EnxovalFormProps {
  item: Enxoval | null;
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

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-size: 1rem;
  color: #495057;
  
  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const EnxovalForm: React.FC<EnxovalFormProps> = ({ item, onClose }) => {
  const { createEnxoval, updateEnxoval, eventos, getEventos } = useAdmin();
  const [formData, setFormData] = useState<Enxoval>({
    nome: '',
    idEvento: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (eventos.length === 0) {
        await getEventos();
      }
      
      if (item) {
        setFormData({
          ...item,
          idEvento: item.idEvento || 0
        });
      }
      
      setIsInitialLoad(false);
    };
    
    if (isInitialLoad) {
      loadData();
    }
  }, [isInitialLoad, item, eventos.length]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome é obrigatório';
    }
    
    if (!formData.idEvento) {
      newErrors.idEvento = 'Selecione um evento';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'idEvento') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      if (item && item.id) {
        await updateEnxoval(item.id, formData);
        alert('Enxoval atualizado com sucesso!');
      } else {
        await createEnxoval(formData);
        alert('Enxoval criado com sucesso!');
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar enxoval:', error);
      alert('Erro ao salvar enxoval. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>{item ? 'Editar Enxoval' : 'Adicionar Novo Enxoval'}</FormTitle>
      
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
          <div style={{ width: '100%' }}>
            <label htmlFor="idEvento">Evento</label>
            <Select
              id="idEvento"
              name="idEvento"
              value={formData.idEvento}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um evento</option>
              {eventos.map(evento => (
                <option key={evento.id} value={evento.id}>
                  {evento.nome} - {new Date(evento.dataHora).toLocaleDateString('pt-BR')}
                </option>
              ))}
            </Select>
            {errors.idEvento && <ErrorMessage>{errors.idEvento}</ErrorMessage>}
          </div>
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

export default EnxovalForm; 