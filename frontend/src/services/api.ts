import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

// Criando uma instância do Axios com configurações padrão
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir o token em todas as requisições
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros nas respostas
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // O servidor respondeu com um status de erro
      const status = error.response.status;
      const data: any = error.response.data;
      
      if (status === 401) {
        // Não autorizado - limpar dados de autenticação e redirecionar para login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        toast.error('Sessão expirada. Por favor, faça login novamente.');
      } else if (status === 403) {
        // Proibido - sem permissão para acessar o recurso
        toast.error('Você não tem permissão para realizar esta ação.');
      } else if (status === 404) {
        // Recurso não encontrado
        toast.error('O recurso solicitado não foi encontrado.');
      } else if (status === 500) {
        // Erro interno do servidor
        toast.error('Ocorreu um erro no servidor. Tente novamente mais tarde.');
      } else {
        // Outros erros
        const message = data?.message || 'Ocorreu um erro na requisição.';
        toast.error(message);
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      toast.error('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } else {
      // Erro na configuração da requisição
      toast.error('Ocorreu um erro inesperado. Tente novamente.');
    }
    
    return Promise.reject(error);
  }
);

export default api;