import { Doacao, Enxoval, ItemEnxoval } from '../../models/interfaces';
import { IDoacaoRepository } from '../repository/IRepository';
import { LocalStorageRepository } from './LocalStorageRepository';

export class DoacaoRepository extends LocalStorageRepository<Doacao> implements IDoacaoRepository {
  constructor() {
    super('doacoes');
  }

  /**
   * Busca todas as doações de um usuário específico
   * @param usuarioId ID do usuário
   * @returns Lista de doações do usuário
   */
  async getByUsuario(usuarioId: number): Promise<Doacao[]> {
    const doacoes = await this.getAll();
    return doacoes.filter(doacao => doacao.idUsuario === usuarioId);
  }

  /**
   * Busca todas as doações relacionadas a um evento específico
   * Isso requer uma busca mais complexa pois precisamos relacionar:
   * doacao -> itemEnxoval -> enxoval -> evento
   * @param eventoId ID do evento
   * @returns Lista de doações do evento
   */
  async getByEvento(eventoId: number): Promise<Doacao[]> {
    // Esta é uma implementação simulada para o localStorage
    // Em uma implementação real com banco de dados, isso seria feito com JOIN's
    
    try {
      // Buscar todos os enxovais do evento
      const enxovais = await this.getAllFromStore<Enxoval>('enxovais');
      const enxovaisDoEvento = enxovais.filter(enxoval => enxoval.idEvento === eventoId);
      
      if (enxovaisDoEvento.length === 0) {
        return [];
      }
      
      // Buscar todos os itens de enxoval relacionados a esses enxovais
      const itensEnxoval = await this.getAllFromStore<ItemEnxoval>('itensEnxoval');
      const idsEnxovais = enxovaisDoEvento.map(enxoval => enxoval.id as number);
      const itensEnxovalDoEvento = itensEnxoval.filter(item => 
        idsEnxovais.includes(item.idEnxoval)
      );
      
      if (itensEnxovalDoEvento.length === 0) {
        return [];
      }
      
      // Buscar todas as doações relacionadas a esses itens de enxoval
      const doacoes = await this.getAll();
      const idsItensEnxoval = itensEnxovalDoEvento.map(item => item.id as number);
      return doacoes.filter(doacao => 
        idsItensEnxoval.includes(doacao.idItemEnxoval)
      );
    } catch (error) {
      console.error('Erro ao buscar doações por evento:', error);
      return [];
    }
  }

  /**
   * Confirma uma doação alterando seu status para CONFIRMADA
   * @param id ID da doação
   * @returns Verdadeiro se a doação foi confirmada com sucesso
   */
  async confirmDoacao(id: number): Promise<boolean> {
    try {
      const doacao = await this.getById(id);
      
      if (!doacao) {
        return false;
      }
      
      doacao.situacao = 1; // CONFIRMADA
      await this.update(id, doacao);
      return true;
    } catch (error) {
      console.error('Erro ao confirmar doação:', error);
      return false;
    }
  }
  
  /**
   * Método auxiliar para buscar dados de qualquer store do localStorage
   * @param storeName Nome do store no localStorage
   * @returns Dados do store
   */
  private async getAllFromStore<T>(storeName: string): Promise<T[]> {
    const dataString = localStorage.getItem(`@Chadebebe:${storeName}`);
    if (!dataString) {
      return [];
    }
    
    try {
      return JSON.parse(dataString);
    } catch (error) {
      console.error(`Erro ao buscar dados de ${storeName}:`, error);
      return [];
    }
  }
} 