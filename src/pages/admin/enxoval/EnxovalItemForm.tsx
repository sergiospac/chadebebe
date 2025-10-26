import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAdmin } from '../../../contexts/AdminContext';
import FormField from '../../../components/common/FormField';
import Button from '../../../components/common/Button';
import { Enxoval, ItemEnxoval, TipoItem } from '../../../models/interfaces';

interface EnxovalItemFormProps {
  item: ItemEnxoval | null;
  enxoval: Enxoval;
  tiposItem: TipoItem[];
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

const ItemPreview = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  
  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 1rem;
  }
  
  .item-info {
    flex: 1;
  }
  
  .item-name {
    font-weight: bold;
    margin-bottom: 0.25rem;
  }
  
  .item-status {
    font-size: 0.875rem;
    color: #6c757d;
  }
`;

const EnxovalItemForm: React.FC<EnxovalItemFormProps> = ({ item, enxoval, tiposItem, onClose }) => {
  const { createItemEnxoval, updateItemEnxoval } = useAdmin();
  const [formData, setFormData] = useState<ItemEnxoval>({
    qtdDisponivel: 0,
    idEnxoval: enxoval.id || 0,
    idTipoItem: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [selectedTipoItem, setSelectedTipoItem] = useState<TipoItem | null>(null);

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        idEnxoval: item.idEnxoval || enxoval.id || 0,
        idTipoItem: item.idTipoItem || 0
      });
      
      if (item.tipoItem) {
        setSelectedTipoItem(item.tipoItem);
      } else if (item.idTipoItem) {
        const tipoItem = tiposItem.find(t => t.id === item.idTipoItem);
        if (tipoItem) {
          setSelectedTipoItem(tipoItem);
        }
      }
    }
  }, [item, enxoval.id, tiposItem]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.idTipoItem) {
      newErrors.idTipoItem = 'Selecione um tipo de item';
    }
    
    if (formData.qtdDisponivel <= 0) {
      newErrors.qtdDisponivel = 'A quantidade deve ser maior que zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'idTipoItem') {
      const tipoItemId = parseInt(value);
      setFormData(prev => ({ ...prev, [name]: tipoItemId }));
      
      // Atualizar o tipo de item selecionado
      const tipoItem = tiposItem.find(t => t.id === tipoItemId);
      setSelectedTipoItem(tipoItem || null);
    } else if (name === 'qtdDisponivel') {
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
        await updateItemEnxoval(item.id, formData);
        alert('Item atualizado com sucesso!');
      } else {
        await createItemEnxoval(formData);
        alert('Item adicionado com sucesso!');
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      alert('Erro ao salvar item. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar apenas os tipos de itens ativos
  const tiposItemAtivos = tiposItem.filter(tipo => tipo.ativo);

  return (
    <FormContainer>
      <FormTitle>{item ? 'Editar Item do Enxoval' : 'Adicionar Novo Item ao Enxoval'}</FormTitle>
      
      <form onSubmit={handleSubmit}>
        <FormRow>
          <div style={{ width: '100%' }}>
            <label htmlFor="idTipoItem">Tipo de Item</label>
            <Select
              id="idTipoItem"
              name="idTipoItem"
              value={formData.idTipoItem}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um tipo de item</option>
              {tiposItemAtivos.map(tipoItem => (
                <option key={tipoItem.id} value={tipoItem.id}>
                  {tipoItem.nome}
                </option>
              ))}
            </Select>
            {errors.idTipoItem && <ErrorMessage>{errors.idTipoItem}</ErrorMessage>}
          </div>
        </FormRow>
        
        {selectedTipoItem && (
          <ItemPreview>
            {selectedTipoItem.imagem && (
              <img src={selectedTipoItem.imagem} alt={selectedTipoItem.nome} />
            )}
            <div className="item-info">
              <div className="item-name">{selectedTipoItem.nome}</div>
              <div className="item-status">
                Status: <span style={{ color: selectedTipoItem.ativo ? '#28a745' : '#dc3545' }}>
                  {selectedTipoItem.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </ItemPreview>
        )}
        
        <FormRow>
          <FormField
            label="Quantidade Disponível"
            name="qtdDisponivel"
            type="number"
            value={formData.qtdDisponivel}
            onChange={handleChange}
            error={errors.qtdDisponivel}
            min={1}
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

export default EnxovalItemForm; 