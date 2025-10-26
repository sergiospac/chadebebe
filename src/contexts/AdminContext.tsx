import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { TipoItem, Evento, Enxoval, ItemEnxoval } from '../models/interfaces';
import { RepositoryFactory } from '../services/repository/RepositoryFactory';

interface AdminContextData {
  // Tipos de Itens
  tiposItem: TipoItem[];
  loadingTiposItem: boolean;
  getTiposItem: () => Promise<void>;
  createTipoItem: (tipoItem: TipoItem) => Promise<TipoItem>;
  updateTipoItem: (id: number, tipoItem: TipoItem) => Promise<TipoItem>;
  deleteTipoItem: (id: number) => Promise<boolean>;
  
  // Eventos
  eventos: Evento[];
  loadingEventos: boolean;
  getEventos: () => Promise<void>;
  getEventosAtivos: () => Promise<Evento[]>;
  createEvento: (evento: Evento) => Promise<Evento>;
  updateEvento: (id: number, evento: Evento) => Promise<Evento>;
  deleteEvento: (id: number) => Promise<boolean>;
  
  // Enxovais
  enxovais: Enxoval[];
  loadingEnxovais: boolean;
  getEnxovais: () => Promise<void>;
  getEnxovaisByEvento: (eventoId: number) => Promise<Enxoval[]>;
  createEnxoval: (enxoval: Enxoval) => Promise<Enxoval>;
  updateEnxoval: (id: number, enxoval: Enxoval) => Promise<Enxoval>;
  deleteEnxoval: (id: number) => Promise<boolean>;
  
  // Itens de Enxoval
  itensEnxoval: ItemEnxoval[];
  loadingItensEnxoval: boolean;
  getItensEnxoval: () => Promise<void>;
  getItensEnxovalByEnxoval: (enxovalId: number) => Promise<ItemEnxoval[]>;
  createItemEnxoval: (itemEnxoval: ItemEnxoval) => Promise<ItemEnxoval>;
  updateItemEnxoval: (id: number, itemEnxoval: ItemEnxoval) => Promise<ItemEnxoval>;
  deleteItemEnxoval: (id: number) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextData>({} as AdminContextData);

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Repositórios
  const tipoItemRepository = RepositoryFactory.createTipoItemRepository();
  const eventoRepository = RepositoryFactory.createEventoRepository();
  const enxovalRepository = RepositoryFactory.createEnxovalRepository();
  const itemEnxovalRepository = RepositoryFactory.createItemEnxovalRepository();
  
  // Estados para TipoItem
  const [tiposItem, setTiposItem] = useState<TipoItem[]>([]);
  const [loadingTiposItem, setLoadingTiposItem] = useState(true);
  
  // Estados para Evento
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loadingEventos, setLoadingEventos] = useState(true);
  
  // Estados para Enxoval
  const [enxovais, setEnxovais] = useState<Enxoval[]>([]);
  const [loadingEnxovais, setLoadingEnxovais] = useState(true);
  
  // Estados para ItemEnxoval
  const [itensEnxoval, setItensEnxoval] = useState<ItemEnxoval[]>([]);
  const [loadingItensEnxoval, setLoadingItensEnxoval] = useState(true);
  
  // Funções para TipoItem
  const getTiposItem = useCallback(async () => {
    setLoadingTiposItem(true);
    try {
      const data = await tipoItemRepository.getAll();
      setTiposItem(data);
    } catch (error) {
      console.error('Erro ao carregar tipos de item:', error);
    } finally {
      setLoadingTiposItem(false);
    }
  }, [tipoItemRepository]);
  
  const createTipoItem = async (tipoItem: TipoItem) => {
    try {
      const newTipoItem = await tipoItemRepository.create(tipoItem);
      setTiposItem(prevTiposItem => [...prevTiposItem, newTipoItem]);
      return newTipoItem;
    } catch (error) {
      console.error('Erro ao criar tipo de item:', error);
      throw error;
    }
  };
  
  const updateTipoItem = async (id: number, tipoItem: TipoItem) => {
    try {
      const updatedTipoItem = await tipoItemRepository.update(id, tipoItem);
      setTiposItem(prevTiposItem => 
        prevTiposItem.map(item => item.id === id ? updatedTipoItem : item)
      );
      return updatedTipoItem;
    } catch (error) {
      console.error('Erro ao atualizar tipo de item:', error);
      throw error;
    }
  };
  
  const deleteTipoItem = async (id: number) => {
    try {
      const result = await tipoItemRepository.delete(id);
      if (result) {
        setTiposItem(prevTiposItem => prevTiposItem.filter(item => item.id !== id));
      }
      return result;
    } catch (error) {
      console.error('Erro ao excluir tipo de item:', error);
      throw error;
    }
  };
  
  // Funções para Evento
  const getEventos = useCallback(async () => {
    setLoadingEventos(true);
    try {
      const data = await eventoRepository.getAll();
      setEventos(data);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoadingEventos(false);
    }
  }, [eventoRepository]);
  
  const getEventosAtivos = async () => {
    try {
      return await eventoRepository.getEventosAtivos();
    } catch (error) {
      console.error('Erro ao carregar eventos ativos:', error);
      return [];
    }
  };
  
  const createEvento = async (evento: Evento) => {
    try {
      const newEvento = await eventoRepository.create(evento);
      setEventos(prevEventos => [...prevEventos, newEvento]);
      return newEvento;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw error;
    }
  };
  
  const updateEvento = async (id: number, evento: Evento) => {
    try {
      const updatedEvento = await eventoRepository.update(id, evento);
      setEventos(prevEventos => 
        prevEventos.map(item => item.id === id ? updatedEvento : item)
      );
      return updatedEvento;
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      throw error;
    }
  };
  
  const deleteEvento = async (id: number) => {
    try {
      const result = await eventoRepository.delete(id);
      if (result) {
        setEventos(prevEventos => prevEventos.filter(item => item.id !== id));
      }
      return result;
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      throw error;
    }
  };
  
  // Funções para Enxoval
  const getEnxovais = useCallback(async () => {
    setLoadingEnxovais(true);
    try {
      const data = await enxovalRepository.getAll();
      setEnxovais(data);
    } catch (error) {
      console.error('Erro ao carregar enxovais:', error);
    } finally {
      setLoadingEnxovais(false);
    }
  }, [enxovalRepository]);
  
  const getEnxovaisByEvento = async (eventoId: number) => {
    try {
      return await enxovalRepository.getByEvento(eventoId);
    } catch (error) {
      console.error('Erro ao carregar enxovais por evento:', error);
      return [];
    }
  };
  
  const createEnxoval = async (enxoval: Enxoval) => {
    try {
      const newEnxoval = await enxovalRepository.create(enxoval);
      setEnxovais(prevEnxovais => [...prevEnxovais, newEnxoval]);
      return newEnxoval;
    } catch (error) {
      console.error('Erro ao criar enxoval:', error);
      throw error;
    }
  };
  
  const updateEnxoval = async (id: number, enxoval: Enxoval) => {
    try {
      const updatedEnxoval = await enxovalRepository.update(id, enxoval);
      setEnxovais(prevEnxovais => 
        prevEnxovais.map(item => item.id === id ? updatedEnxoval : item)
      );
      return updatedEnxoval;
    } catch (error) {
      console.error('Erro ao atualizar enxoval:', error);
      throw error;
    }
  };
  
  const deleteEnxoval = async (id: number) => {
    try {
      const result = await enxovalRepository.delete(id);
      if (result) {
        setEnxovais(prevEnxovais => prevEnxovais.filter(item => item.id !== id));
      }
      return result;
    } catch (error) {
      console.error('Erro ao excluir enxoval:', error);
      throw error;
    }
  };
  
  // Funções para ItemEnxoval
  const getItensEnxoval = useCallback(async () => {
    setLoadingItensEnxoval(true);
    try {
      const data = await itemEnxovalRepository.getAll();
      setItensEnxoval(data);
    } catch (error) {
      console.error('Erro ao carregar itens de enxoval:', error);
    } finally {
      setLoadingItensEnxoval(false);
    }
  }, [itemEnxovalRepository]);
  
  const getItensEnxovalByEnxoval = async (enxovalId: number) => {
    try {
      return await itemEnxovalRepository.getByEnxoval(enxovalId);
    } catch (error) {
      console.error('Erro ao carregar itens por enxoval:', error);
      return [];
    }
  };
  
  const createItemEnxoval = async (itemEnxoval: ItemEnxoval) => {
    try {
      const newItemEnxoval = await itemEnxovalRepository.create(itemEnxoval);
      setItensEnxoval(prevItensEnxoval => [...prevItensEnxoval, newItemEnxoval]);
      return newItemEnxoval;
    } catch (error) {
      console.error('Erro ao criar item de enxoval:', error);
      throw error;
    }
  };
  
  const updateItemEnxoval = async (id: number, itemEnxoval: ItemEnxoval) => {
    try {
      const updatedItemEnxoval = await itemEnxovalRepository.update(id, itemEnxoval);
      setItensEnxoval(prevItensEnxoval => 
        prevItensEnxoval.map(item => item.id === id ? updatedItemEnxoval : item)
      );
      return updatedItemEnxoval;
    } catch (error) {
      console.error('Erro ao atualizar item de enxoval:', error);
      throw error;
    }
  };
  
  const deleteItemEnxoval = async (id: number) => {
    try {
      const result = await itemEnxovalRepository.delete(id);
      if (result) {
        setItensEnxoval(prevItensEnxoval => prevItensEnxoval.filter(item => item.id !== id));
      }
      return result;
    } catch (error) {
      console.error('Erro ao excluir item de enxoval:', error);
      throw error;
    }
  };
  
  // Efeitos para carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        getTiposItem(),
        getEventos(),
        getEnxovais(),
        getItensEnxoval()
      ]);
    };
    
    loadInitialData();
  }, []);
  
  return (
    <AdminContext.Provider value={{
      // Tipos de Itens
      tiposItem,
      loadingTiposItem,
      getTiposItem,
      createTipoItem,
      updateTipoItem,
      deleteTipoItem,
      
      // Eventos
      eventos,
      loadingEventos,
      getEventos,
      getEventosAtivos,
      createEvento,
      updateEvento,
      deleteEvento,
      
      // Enxovais
      enxovais,
      loadingEnxovais,
      getEnxovais,
      getEnxovaisByEvento,
      createEnxoval,
      updateEnxoval,
      deleteEnxoval,
      
      // Itens de Enxoval
      itensEnxoval,
      loadingItensEnxoval,
      getItensEnxoval,
      getItensEnxovalByEnxoval,
      createItemEnxoval,
      updateItemEnxoval,
      deleteItemEnxoval
    }}>
      {children}
    </AdminContext.Provider>
  );
}; 