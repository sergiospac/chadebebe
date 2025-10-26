import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAdmin } from '../../../contexts/AdminContext';
import FormField from '../../../components/common/FormField';
import Button from '../../../components/common/Button';
import { TipoItem } from '../../../models/interfaces';

interface TipoItemFormProps {
  item: TipoItem | null;
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

const ImagePreview = styled.div`
  margin-top: 0.5rem;
  
  img {
    max-width: 100px;
    max-height: 100px;
    border-radius: 4px;
    border: 1px solid #dee2e6;
  }
`;

const TipoItemForm: React.FC<TipoItemFormProps> = ({ item, onClose }) => {
  const { createTipoItem, updateTipoItem } = useAdmin();
  const [formData, setFormData] = useState<TipoItem>({
    nome: '',
    imagem: '',
    ativo: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        ...item
      });
    }
  }, [item]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
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
        await updateTipoItem(item.id, formData);
        alert('Tipo de item atualizado com sucesso!');
      } else {
        await createTipoItem(formData);
        alert('Tipo de item criado com sucesso!');
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar tipo de item:', error);
      alert('Erro ao salvar tipo de item. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>{item ? 'Editar Tipo de Item' : 'Adicionar Novo Tipo de Item'}</FormTitle>
      
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
            label="URL da Imagem"
            name="imagem"
            value={formData.imagem || ''}
            onChange={handleChange}
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </FormRow>
        
        {formData.imagem && (
          <ImagePreview>
            <img src={formData.imagem} alt="Preview" />
          </ImagePreview>
        )}
        
        <FormRow>
          <div>
            <label>
              <input
                type="checkbox"
                name="ativo"
                checked={formData.ativo}
                onChange={handleChange}
              />
              {' '}Ativo
            </label>
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

export default TipoItemForm; 