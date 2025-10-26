import { Usuario } from '../../models/interfaces';
import { IUsuarioRepository } from '../repository/IRepository';
import { LocalStorageRepository } from './LocalStorageRepository';

export class UsuarioLocalStorageRepository extends LocalStorageRepository<Usuario> implements IUsuarioRepository {
  constructor() {
    super('usuarios');
    this.initializeAdmin();
  }

  private async initializeAdmin() {
    const usuarios = await this.getAll();
    
    if (usuarios.length === 0) {
      // Criar usuário administrador padrão se não existir nenhum usuário
      await this.create({
        nome: 'Administrador',
        email: 'admin@gap.org',
        senha: 'admin123', // Em produção seria um hash
        tel: '(00) 00000-0000',
        adm: true
      });
      
      // Criar usuário comum para testes
      await this.create({
        nome: 'Usuário Teste',
        email: 'usuario@teste.com',
        senha: '123456', // Em produção seria um hash
        tel: '(11) 11111-1111',
        adm: false
      });
    }
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuarios = await this.getAll();
    const usuario = usuarios.find(u => u.email === email);
    return usuario || null;
  }

  async authenticate(email: string, senha: string): Promise<Usuario | null> {
    const usuario = await this.findByEmail(email);
    
    // Em produção, isso usaria um comparador de hash, não texto plano
    if (usuario && usuario.senha === senha) {
      // Não retornar a senha para o cliente
      const { senha: _, ...usuarioSemSenha } = usuario;
      return usuarioSemSenha as Usuario;
    }
    
    return null;
  }
} 