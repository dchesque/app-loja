import api from './api';

export interface Fornecedor {
  id?: number;
  codigo: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  inscricao_estadual?: string;
  telefone?: string;
  email?: string;
  contato?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  website?: string;
  categoria?: string;
  observacoes?: string;
  status: 'ativo' | 'inativo';
  created_at?: string;
  updated_at?: string;
}

export interface FornecedorFilter {
  codigo?: string;
  razao_social?: string;
  nome_fantasia?: string;
  cnpj?: string;
  cidade?: string;
  uf?: string;
  categoria?: string;
  status?: 'ativo' | 'inativo';
  page?: number;
  pageSize?: number;
}

class FornecedorService {
  // Método para listar fornecedores com filtros e paginação
  async listarFornecedores(filtros: FornecedorFilter = {}): Promise<any> {
    const response = await api.get('/fornecedores', { params: filtros });
    return response.data;
  }

  // Método para obter um fornecedor pelo ID
  async obterFornecedorPorId(id: number): Promise<Fornecedor> {
    const response = await api.get(`/fornecedores/${id}`);
    return response.data.data;
  }

  // Método para criar um novo fornecedor
  async criarFornecedor(fornecedorData: Fornecedor): Promise<Fornecedor> {
    const response = await api.post('/fornecedores', fornecedorData);
    return response.data.data;
  }

  // Método para atualizar um fornecedor
  async atualizarFornecedor(id: number, fornecedorData: Partial<Fornecedor>): Promise<Fornecedor> {
    const response = await api.put(`/fornecedores/${id}`, fornecedorData);
    return response.data.data;
  }

  // Método para excluir um fornecedor
  async excluirFornecedor(id: number): Promise<void> {
    await api.delete(`/fornecedores/${id}`);
  }
}

// Exportando instância do serviço
const fornecedorService = new FornecedorService();
export default fornecedorService;