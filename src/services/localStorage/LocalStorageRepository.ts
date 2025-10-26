import { IRepository } from '../repository/IRepository';

export class LocalStorageRepository<T extends { id?: number }> implements IRepository<T> {
  private collection: string;

  constructor(collectionName: string) {
    this.collection = collectionName;
    this.initializeCollection();
  }

  private initializeCollection() {
    if (!localStorage.getItem(this.collection)) {
      localStorage.setItem(this.collection, JSON.stringify([]));
    }
  }

  private getNextId(): number {
    const items = this.getCollectionData();
    if (items.length === 0) return 1;
    return Math.max(...items.map(item => item.id || 0)) + 1;
  }

  private getCollectionData(): T[] {
    const data = localStorage.getItem(this.collection);
    return data ? JSON.parse(data) : [];
  }

  private saveCollectionData(data: T[]): void {
    localStorage.setItem(this.collection, JSON.stringify(data));
  }

  async getAll(): Promise<T[]> {
    return this.getCollectionData();
  }

  async getById(id: number): Promise<T | null> {
    const items = this.getCollectionData();
    const item = items.find(item => item.id === id);
    return item || null;
  }

  async create(item: T): Promise<T> {
    const items = this.getCollectionData();
    const newItem = { ...item, id: this.getNextId() };
    items.push(newItem as T);
    this.saveCollectionData(items);
    return newItem as T;
  }

  async update(id: number, item: T): Promise<T> {
    const items = this.getCollectionData();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`Item com id ${id} não encontrado na coleção ${this.collection}`);
    }
    
    const updatedItem = { ...items[index], ...item, id };
    items[index] = updatedItem;
    this.saveCollectionData(items);
    
    return updatedItem;
  }

  async delete(id: number): Promise<boolean> {
    const items = this.getCollectionData();
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length === items.length) {
      return false;
    }
    
    this.saveCollectionData(filteredItems);
    return true;
  }
} 