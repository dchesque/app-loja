import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export enum UserRole {
  MASTER_ADMIN = 'MASTER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
  createdAt?: string;
  lastLogin?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

class AuthService {
  // Método para fazer login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Salvar token e usuário no localStorage
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  }

  // Método para obter informações do usuário logado
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<{ success: boolean; data: User }>('/auth/me');
      
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data.data;
      }
      
      return null;
    } catch (error) {
      // Se houver erro, provavelmente o token é inválido
      this.logout();
      return null;
    }
  }

  // Método para verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Método para obter o usuário atual do localStorage
  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Método para fazer logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Método para listar usuários (admin e master_admin)
  async listUsers(page: number = 1, pageSize: number = 10): Promise<any> {
    const response = await api.get('/auth/users', {
      params: { page, pageSize }
    });
    return response.data;
  }

  // Método para criar um novo usuário (admin e master_admin)
  async createUser(userData: any): Promise<any> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  // Método para atualizar um usuário (admin e master_admin)
  async updateUser(userId: string, userData: any): Promise<any> {
    const response = await api.put(`/auth/users/${userId}`, userData);
    return response.data;
  }

  // Método para desativar um usuário (admin e master_admin)
  async deactivateUser(userId: string): Promise<any> {
    const response = await api.delete(`/auth/users/${userId}`);
    return response.data;
  }
}

// Corrigindo o warning de exportação anônima
const authService = new AuthService();
export default authService;