import { Enxoval } from '../../models/interfaces';
import { IEnxovalRepository } from '../repository/IRepository';
import { LocalStorageRepository } from './LocalStorageRepository';
import { EventoLocalStorageRepository } from './EventoRepository';

export class EnxovalLocalStorageRepository extends LocalStorageRepository<Enxoval> implements IEnxovalRepository {
  private eventoRepository: EventoLocalStorageRepository;
  
  constructor() {
    super('enxovais');
    this.eventoRepository = new EventoLocalStorageRepository();
  }

  async getByEvento(eventoId: number): Promise<Enxoval[]> {
    const enxovais = await this.getAll();
    return enxovais.filter(enxoval => enxoval.idEvento === eventoId);
  }

  async getAll(): Promise<Enxoval[]> {
    const enxovais = await super.getAll();
    const eventos = await this.eventoRepository.getAll();
    
    // Adicionar os dados do evento em cada enxoval
    return enxovais.map(enxoval => {
      const evento = eventos.find(e => e.id === enxoval.idEvento);
      return { ...enxoval, evento };
    });
  }

  async getById(id: number): Promise<Enxoval | null> {
    const enxoval = await super.getById(id);
    
    if (!enxoval) return null;
    
    const evento = await this.eventoRepository.getById(enxoval.idEvento);
    return { ...enxoval, evento: evento || undefined };
  }
} 