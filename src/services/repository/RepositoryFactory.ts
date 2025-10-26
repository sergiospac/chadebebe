import { 
  IUsuarioRepository, 
  IEventoRepository, 
  IEnxovalRepository, 
  IItemEnxovalRepository,
  IDoacaoRepository 
} from './IRepository';
import { UsuarioLocalStorageRepository } from '../localStorage/UsuarioRepository';
import { TipoItemLocalStorageRepository } from '../localStorage/TipoItemRepository';
import { EventoLocalStorageRepository } from '../localStorage/EventoRepository';
import { EnxovalLocalStorageRepository } from '../localStorage/EnxovalRepository';
import { ItemEnxovalLocalStorageRepository } from '../localStorage/ItemEnxovalRepository';
import { DoacaoRepository } from '../localStorage/DoacaoRepository';

// Importar as demais implementações conforme forem criadas

// Enum para facilitar a escolha da implementação
export enum RepositoryType {
  LOCAL_STORAGE = 'localStorage',
  API = 'api'
}

// Classe factory para criar os repositórios
export class RepositoryFactory {
  private static repositoryType: RepositoryType = RepositoryType.LOCAL_STORAGE;

  // Método para definir qual implementação será usada
  static setRepositoryType(type: RepositoryType): void {
    this.repositoryType = type;
  }

  // Métodos factory para cada tipo de repositório
  static createUsuarioRepository(): IUsuarioRepository {
    switch (this.repositoryType) {
      case RepositoryType.LOCAL_STORAGE:
        return new UsuarioLocalStorageRepository();
      case RepositoryType.API:
        // Retornará a implementação de API quando for criada
        throw new Error('Repositório de API ainda não implementado');
      default:
        return new UsuarioLocalStorageRepository();
    }
  }

  static createTipoItemRepository(): TipoItemLocalStorageRepository {
    switch (this.repositoryType) {
      case RepositoryType.LOCAL_STORAGE:
        return new TipoItemLocalStorageRepository();
      case RepositoryType.API:
        throw new Error('Repositório de API ainda não implementado');
      default:
        return new TipoItemLocalStorageRepository();
    }
  }

  static createEventoRepository(): IEventoRepository {
    switch (this.repositoryType) {
      case RepositoryType.LOCAL_STORAGE:
        return new EventoLocalStorageRepository();
      case RepositoryType.API:
        throw new Error('Repositório de API ainda não implementado');
      default:
        return new EventoLocalStorageRepository();
    }
  }

  static createEnxovalRepository(): IEnxovalRepository {
    switch (this.repositoryType) {
      case RepositoryType.LOCAL_STORAGE:
        return new EnxovalLocalStorageRepository();
      case RepositoryType.API:
        throw new Error('Repositório de API ainda não implementado');
      default:
        return new EnxovalLocalStorageRepository();
    }
  }

  static createItemEnxovalRepository(): IItemEnxovalRepository {
    switch (this.repositoryType) {
      case RepositoryType.LOCAL_STORAGE:
        return new ItemEnxovalLocalStorageRepository();
      case RepositoryType.API:
        throw new Error('Repositório de API ainda não implementado');
      default:
        return new ItemEnxovalLocalStorageRepository();
    }
  }

  static createDoacaoRepository(): IDoacaoRepository {
    switch (this.repositoryType) {
      case RepositoryType.LOCAL_STORAGE:
        return new DoacaoRepository();
      case RepositoryType.API:
        throw new Error('Repositório de API ainda não implementado');
      default:
        return new DoacaoRepository();
    }
  }
} 