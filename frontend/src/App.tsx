import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Removendo a importação não utilizada de useAuth
import { AuthProvider } from './store/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
// Vamos ajustar o caminho para o LoginPage se ele estiver em outro local
import LoginPage from './pages/Auth/LoginPage'; // Alterado para o caminho correto
import Dashboard from './pages/Dashboard';
import ListaClientes from './pages/Clientes/ListaClientes';
import FormCliente from './pages/Clientes/FormCliente';
import NaoEncontrado from './pages/NaoEncontrado';
import AcessoNegado from './pages/AcessoNegado';

// Removendo a importação não utilizada do UserRole
// import { UserRole } from './services/authService';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rota principal: redireciona para dashboard se logado ou login se não */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Rotas protegidas - Qualquer usuário autenticado pode acessar */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Rotas de Clientes */}
          <Route
            path="/clientes"
            element={
              <ProtectedRoute>
                <ListaClientes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes/novo"
            element={
              <ProtectedRoute>
                <FormCliente />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes/:id"
            element={
              <ProtectedRoute>
                <FormCliente />
              </ProtectedRoute>
            }
          />

          {/* Rotas de Acesso Negado e Não Encontrado */}
          <Route path="/acesso-negado" element={<AcessoNegado />} />
          <Route path="*" element={<NaoEncontrado />} />
        </Routes>

        {/* Configuração do Toast para notificações */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;