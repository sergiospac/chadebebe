import { ItemEnxoval } from '../../models/interfaces';
import { IItemEnxovalRepository } from '../repository/IRepository';
import { LocalStorageRepository } from './LocalStorageRepository';
import { EnxovalLocalStorageRepository } from './EnxovalRepository';
import { TipoItemLocalStorageRepository } from './TipoItemRepository';

export class ItemEnxovalLocalStorageRepository extends LocalStorageRepository<ItemEnxoval> implements IItemEnxovalRepository {
  private enxovalRepository: EnxovalLocalStorageRepository;
  private tipoItemRepository: TipoItemLocalStorageRepository;
  
  constructor() {
    super('itensEnxoval');
    this.enxovalRepository = new EnxovalLocalStorageRepository();
    this.tipoItemRepository = new TipoItemLocalStorageRepository();
  }

  async getByEnxoval(enxovalId: number): Promise<ItemEnxoval[]> {
    const itens = await this.getAll();
    return itens.filter(item => item.idEnxoval === enxovalId);
  }

  async updateQuantidade(id: number, quantidadeDoada: number): Promise<boolean> {
    const item = await this.getById(id);
    
    if (!item) return false;
    
    // Verificar se há quantidade disponível suficiente
    if (item.qtdDisponivel < quantidadeDoada) {
      return false;
    }
    
    // Atualizar a quantidade disponível
    const novaQuantidade = item.qtdDisponivel - quantidadeDoada;
    await this.update(id, { ...item, qtdDisponivel: novaQuantidade });
    
    return true;
  }

  async getAll(): Promise<ItemEnxoval[]> {
    const itens = await super.getAll();
    const tiposItem = await this.tipoItemRepository.getAll();
    const enxovais = await this.enxovalRepository.getAll();
    
    // Adicionar os dados do tipo de item e enxoval em cada item
    return itens.map(item => {
      const tipoItem = tiposItem.find(t => t.id === item.idTipoItem);
      const enxoval = enxovais.find(e => e.id === item.idEnxoval);
      return { ...item, tipoItem, enxoval };
    });
  }

  async getById(id: number): Promise<ItemEnxoval | null> {
    const item = await super.getById(id);
    
    if (!item) return null;
    
    const tipoItem = await this.tipoItemRepository.getById(item.idTipoItem);
    const enxoval = await this.enxovalRepository.getById(item.idEnxoval);
    
    return { ...item, tipoItem: tipoItem || undefined, enxoval: enxoval || undefined };
  }
} 