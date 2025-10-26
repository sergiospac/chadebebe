export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  tel: string;
  adm: boolean;
}

export interface Evento {
  id?: number;
  nome: string;
  dataHora: Date | string;
  local: string;
}

export interface TipoItem {
  id?: number;
  nome: string;
  imagem?: string;
  ativo: boolean;
}

export interface Enxoval {
  id?: number;
  nome: string;
  idEvento: number;
  evento?: Evento;
}

export interface ItemEnxoval {
  id?: number;
  qtdDisponivel: number;
  idEnxoval: number;
  idTipoItem: number;
  enxoval?: Enxoval;
  tipoItem?: TipoItem;
}

export interface Doacao {
  id?: number;
  qtd: number;
  situacao: number;
  data: Date | string;
  idUsuario: number;
  idItemEnxoval: number;
  usuario?: Usuario;
  itemEnxoval?: ItemEnxoval;
}

export enum SituacaoDoacao {
  PENDENTE = 0,
  CONFIRMADA = 1,
  ENTREGUE = 2,
  CANCELADA = 3
}

export interface AuthContextData {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  registrar: (usuario: Usuario) => Promise<boolean>;
} 