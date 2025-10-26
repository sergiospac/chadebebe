export interface IRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T | null>;
  create(item: T): Promise<T>;
  update(id: number, item: T): Promise<T>;
  delete(id: number): Promise<boolean>;
}

export interface IUsuarioRepository extends IRepository<any> {
  findByEmail(email: string): Promise<any | null>;
  authenticate(email: string, senha: string): Promise<any | null>;
}

export interface IEventoRepository extends IRepository<any> {
  getEventosAtivos(): Promise<any[]>;
}

export interface IEnxovalRepository extends IRepository<any> {
  getByEvento(eventoId: number): Promise<any[]>;
}

export interface IItemEnxovalRepository extends IRepository<any> {
  getByEnxoval(enxovalId: number): Promise<any[]>;
  updateQuantidade(id: number, quantidadeDoada: number): Promise<boolean>;
}

export interface IDoacaoRepository extends IRepository<any> {
  getByUsuario(usuarioId: number): Promise<any[]>;
  getByEvento(eventoId: number): Promise<any[]>;
  confirmDoacao(id: number): Promise<boolean>;
} 