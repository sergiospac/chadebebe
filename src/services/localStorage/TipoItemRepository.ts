import { TipoItem } from '../../models/interfaces';
import { IRepository } from '../repository/IRepository';
import { LocalStorageRepository } from './LocalStorageRepository';

export class TipoItemLocalStorageRepository extends LocalStorageRepository<TipoItem> implements IRepository<TipoItem> {
  constructor() {
    super('tiposItem');
    this.initializeDefaultItems();
  }

  private async initializeDefaultItems() {
    const items = await this.getAll();
    
    if (items.length === 0) {
      // Criar alguns tipos de itens padrão para demonstração
      await this.create({
        nome: 'Fralda P',
        imagem: '/assets/images/fralda-p.jpg',
        ativo: true
      });
      
      await this.create({
        nome: 'Fralda M',
        imagem: '/assets/images/fralda-m.jpg',
        ativo: true
      });
      
      await this.create({
        nome: 'Body menina',
        imagem: '/assets/images/body-menina.jpg',
        ativo: true
      });
      
      await this.create({
        nome: 'Body menino',
        imagem: '/assets/images/body-menino.jpg',
        ativo: true
      });

        await this.create({
          nome: 'Chupeta menino',
          imagem: '/assets/images/chupeta-menino.jpg',
          ativo: true
        });

      await this.create({
        nome: 'Chupeta menina',
        imagem: '/assets/images/chupeta-menina.jpg',
        ativo: true
      });

      await this.create({
        nome: 'Macacão menina',
        imagem: '/assets/images/macacao-menina.jpg',
        ativo: true
      });

      await this.create({
        nome: 'Macacão menino',
        imagem: '/assets/images/macacao-menino.jpg',
        ativo: true
      });

      await this.create({
        nome: 'Sapato Amarelo',
        imagem: '/assets/images/sapato-amarelo.jpg',
        ativo: true
      });

      await this.create({
        nome: 'Sapato Azul',
        imagem: '/assets/images/sapato-azul.jpg',
        ativo: true
      });

    }
  }
} 