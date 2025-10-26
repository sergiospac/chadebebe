import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { Evento, Enxoval, ItemEnxoval, Doacao, SituacaoDoacao } from '../models/interfaces';
import { RepositoryFactory } from '../services/repository/RepositoryFactory';
import { useAuth } from './AuthContext';

// Interface para o contexto de usuário
interface UserContextData {
  // Estados
  eventos: Evento[];
  eventosLoading: boolean;
  enxovais: Enxoval[];
  enxovaisLoading: boolean;
  itensEnxoval: ItemEnxoval[];
  itensEnxovalLoading: boolean;
  doacoesUsuario: Doacao[];
  doacoesLoading: boolean;
  
  // Métodos
  getEventos: () => Promise<void>;
  getEnxovaisByEvento: (eventoId: number) => Promise<void>;
  getItensEnxovalByEnxoval: (enxovalId: number) => Promise<void>;
  getDoacoesByUsuario: () => Promise<void>;
  fazerDoacao: (idItemEnxoval: number, quantidade: number) => Promise<boolean>;
  cancelarDoacao: (idDoacao: number) => Promise<boolean>;
}

// Criação do contexto com valor inicial padrão
const UserContext = createContext<UserContextData>({
  eventos: [],
  eventosLoading: false,
  enxovais: [],
  enxovaisLoading: false,
  itensEnxoval: [],
  itensEnxovalLoading: false,
  doacoesUsuario: [],
  doacoesLoading: false,
  
  getEventos: async () => {},
  getEnxovaisByEvento: async () => {},
  getItensEnxovalByEnxoval: async () => {},
  getDoacoesByUsuario: async () => {},
  fazerDoacao: async () => false,
  cancelarDoacao: async () => false
});

// Hook personalizado para facilitar o uso do contexto
export const useUser = () => useContext(UserContext);

// Interface para as propriedades do provider
interface UserProviderProps {
  children: React.ReactNode;
}

// Provider do contexto de usuário
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { usuario } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  
  // Estados
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventosLoading, setEventosLoading] = useState<boolean>(false);
  
  const [enxovais, setEnxovais] = useState<Enxoval[]>([]);
  const [enxovaisLoading, setEnxovaisLoading] = useState<boolean>(false);
  
  const [itensEnxoval, setItensEnxoval] = useState<ItemEnxoval[]>([]);
  const [itensEnxovalLoading, setItensEnxovalLoading] = useState<boolean>(false);
  
  const [doacoesUsuario, setDoacoesUsuario] = useState<Doacao[]>([]);
  const [doacoesLoading, setDoacoesLoading] = useState<boolean>(false);
  
  // Carregar eventos ao iniciar
  useEffect(() => {
    if (isInitialLoad) {
      getEventos();
      if (usuario) {
        getDoacoesByUsuario();
      }
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, usuario]);
  
  // Método para buscar eventos ativos
  const getEventos = useCallback(async () => {
    try {
      setEventosLoading(true);
      const eventoRepository = RepositoryFactory.createEventoRepository();
      const eventosData = await eventoRepository.getEventosAtivos();
      
      // Converter string de data para objeto Date
      const eventosFormatados = eventosData.map(evento => ({
        ...evento,
        dataHora: new Date(evento.dataHora)
      }));
      
      setEventos(eventosFormatados);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setEventosLoading(false);
    }
  }, []);
  
  // Método para buscar enxovais por evento
  const getEnxovaisByEvento = useCallback(async (eventoId: number) => {
    try {
      setEnxovaisLoading(true);
      const enxovalRepository = RepositoryFactory.createEnxovalRepository();
      const enxovaisData = await enxovalRepository.getByEvento(eventoId);
      setEnxovais(enxovaisData);
    } catch (error) {
      console.error('Erro ao buscar enxovais:', error);
    } finally {
      setEnxovaisLoading(false);
    }
  }, []);
  
  // Método para buscar itens de um enxoval
  const getItensEnxovalByEnxoval = useCallback(async (enxovalId: number) => {
    try {
      setItensEnxovalLoading(true);
      const itemEnxovalRepository = RepositoryFactory.createItemEnxovalRepository();
      const itensData = await itemEnxovalRepository.getByEnxoval(enxovalId);
      setItensEnxoval(itensData);
    } catch (error) {
      console.error('Erro ao buscar itens do enxoval:', error);
    } finally {
      setItensEnxovalLoading(false);
    }
  }, []);
  
  // Método para buscar doações do usuário atual
  const getDoacoesByUsuario = useCallback(async () => {
    if (!usuario?.id) return;
    
    try {
      setDoacoesLoading(true);
      const doacaoRepository = RepositoryFactory.createDoacaoRepository();
      const doacoesData = await doacaoRepository.getByUsuario(usuario.id);
      
      // Converter string de data para objeto Date
      const doacoesFormatadas = doacoesData.map(doacao => ({
        ...doacao,
        data: new Date(doacao.data)
      }));
      
      setDoacoesUsuario(doacoesFormatadas);
    } catch (error) {
      console.error('Erro ao buscar doações do usuário:', error);
    } finally {
      setDoacoesLoading(false);
    }
  }, [usuario]);
  
  // Método para fazer uma nova doação
  const fazerDoacao = useCallback(async (idItemEnxoval: number, quantidade: number): Promise<boolean> => {
    if (!usuario?.id) return false;
    
    try {
      const doacaoRepository = RepositoryFactory.createDoacaoRepository();
      const itemEnxovalRepository = RepositoryFactory.createItemEnxovalRepository();
      
      // Criar objeto de doação
      const novaDoacao: Doacao = {
        qtd: quantidade,
        situacao: SituacaoDoacao.PENDENTE,
        data: new Date(),
        idUsuario: usuario.id,
        idItemEnxoval: idItemEnxoval
      };
      
      // Salvar a doação
      const doacaoCriada = await doacaoRepository.create(novaDoacao);
      
      if (doacaoCriada) {
        // Atualizar a quantidade disponível no item do enxoval
        await itemEnxovalRepository.updateQuantidade(idItemEnxoval, quantidade);
        
        // Atualizar a lista de doações do usuário
        await getDoacoesByUsuario();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao fazer doação:', error);
      return false;
    }
  }, [usuario, getDoacoesByUsuario]);
  
  // Método para cancelar uma doação
  const cancelarDoacao = useCallback(async (idDoacao: number): Promise<boolean> => {
    try {
      const doacaoRepository = RepositoryFactory.createDoacaoRepository();
      
      // Buscar a doação para obter os detalhes
      const doacao = await doacaoRepository.getById(idDoacao);
      
      if (!doacao) {
        return false;
      }
      
      // Atualizar a situação da doação para cancelada
      doacao.situacao = SituacaoDoacao.CANCELADA;
      await doacaoRepository.update(idDoacao, doacao);
      
      // Atualizar a quantidade disponível no item do enxoval
      const itemEnxovalRepository = RepositoryFactory.createItemEnxovalRepository();
      await itemEnxovalRepository.updateQuantidade(doacao.idItemEnxoval, -doacao.qtd);
      
      // Atualizar a lista de doações do usuário
      await getDoacoesByUsuario();
      
      return true;
    } catch (error) {
      console.error('Erro ao cancelar doação:', error);
      return false;
    }
  }, [getDoacoesByUsuario]);
  
  return (
    <UserContext.Provider 
      value={{ 
        eventos, 
        eventosLoading, 
        enxovais, 
        enxovaisLoading, 
        itensEnxoval, 
        itensEnxovalLoading, 
        doacoesUsuario, 
        doacoesLoading,
        getEventos,
        getEnxovaisByEvento,
        getItensEnxovalByEnxoval,
        getDoacoesByUsuario,
        fazerDoacao,
        cancelarDoacao
      }}
    >
      {children}
    </UserContext.Provider>
  );
}; 