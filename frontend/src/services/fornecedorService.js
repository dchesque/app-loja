import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class FornecedorService {
  // Obter todos os fornecedores com paginação e filtros
  async getFornecedores(params = {}) {
    const token = authService.getToken();
    const response = await axios.get(`${API_URL}/fornecedores`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    });
    
    return response.data;
  }

  // Obter fornecedor por ID
  async getFornecedorById(id) {
    const token = authService.getToken();
    const response = await axios.get(`${API_URL}/fornecedores/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  }

  // Criar um novo fornecedor
  async createFornecedor(fornecedorData) {
    const token = authService.getToken();
    const response = await axios.post(`${API_URL}/fornecedores`, fornecedorData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  }

  // Atualizar um fornecedor existente
  async updateFornecedor(id, fornecedorData) {
    const token = authService.getToken();
    const response = await axios.put(`${API_URL}/fornecedores/${id}`, fornecedorData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  }

  // Excluir um fornecedor
  async deleteFornecedor(id) {
    const token = authService.getToken();
    const response = await axios.delete(`${API_URL}/fornecedores/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  }
}

export default new FornecedorService();