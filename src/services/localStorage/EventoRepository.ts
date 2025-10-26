import { Evento } from '../../models/interfaces';
import { IEventoRepository } from '../repository/IRepository';
import { LocalStorageRepository } from './LocalStorageRepository';

export class EventoLocalStorageRepository extends LocalStorageRepository<Evento> implements IEventoRepository {
  constructor() {
    super('eventos');
    this.initializeDefaultEvents();
  }

  private async initializeDefaultEvents() {
    const eventos = await this.getAll();
    
    if (eventos.length === 0) {
      // Criar alguns eventos padrão para demonstração
      const dataAtual = new Date();
      const proximoMes = new Date();
      proximoMes.setMonth(proximoMes.getMonth() + 1);
      
      await this.create({
        nome: 'Doação de Março',
        dataHora: dataAtual.toISOString(),
        local: 'Centro Comunitário Vila Nova'
      });
      
      await this.create({
        nome: 'Doação de Abril',
        dataHora: proximoMes.toISOString(),
        local: 'Escola Municipal Santa Terezinha'
      });
    }
  }

  async getEventosAtivos(): Promise<Evento[]> {
    const eventos = await this.getAll();
    const dataAtual = new Date();
    
    // Considerar como "ativo" eventos cuja data é igual ou posterior à data atual
    return eventos.filter(evento => {
      const dataEvento = new Date(evento.dataHora);
      return dataEvento >= dataAtual;
    });
  }
} 