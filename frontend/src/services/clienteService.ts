import api from './api';

export interface Cliente {
  id?: number;
  codigo: string;
  loja: string;
  nome: string;
  cpf: string;
  data_nascimento?: string;
  nome_cliente: string;
  classificacao1?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  tipo_res?: string;
  telefone?: string;
  celular?: string;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClienteFilter {
  codigo?: string;
  loja?: string;
  nome?: string;
  cpf?: string;
  cidade?: string;
  uf?: string;
  page?: number;
  pageSize?: number;
}

class ClienteService {
  // Método para listar clientes com filtros e paginação
  async listarClientes(filtros: ClienteFilter = {}): Promise<any> {
    const response = await api.get('/clientes', { params: filtros });
    return response.data;
  }

  // Método para obter um cliente pelo ID
  async obterClientePorId(id: number): Promise<Cliente> {
    const response = await api.get(`/clientes/${id}`);
    return response.data.data;
  }

  // Método para criar um novo cliente
  async criarCliente(clienteData: Cliente): Promise<Cliente> {
    const response = await api.post('/clientes', clienteData);
    return response.data.data;
  }

  // Método para atualizar um cliente
  async atualizarCliente(id: number, clienteData: Partial<Cliente>): Promise<Cliente> {
    const response = await api.put(`/clientes/${id}`, clienteData);
    return response.data.data;
  }

  // Método para excluir um cliente
  async excluirCliente(id: number): Promise<void> {
    await api.delete(`/clientes/${id}`);
  }

  // Método para importar clientes a partir de um arquivo XLSX
  async importarClientes(arquivo: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', arquivo);

    const response = await api.post('/clientes/importar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  }
}

// Corrigindo o warning de exportação anônima
const clienteService = new ClienteService();
export default clienteService;