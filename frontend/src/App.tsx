import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './store/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/Auth/LoginPage';
import Dashboard from './pages/Dashboard';
import ListaClientes from './pages/Clientes/ListaClientes';
import FormCliente from './pages/Clientes/FormCliente';
import ListaFornecedores from './pages/Fornecedores/ListaFornecedores';
import FormFornecedor from './pages/Fornecedores/FormFornecedor';
import VisualizarFornecedores from './pages/Fornecedores/VisualizarFornecedores';
import NaoEncontrado from './pages/NaoEncontrado';
import AcessoNegado from './pages/AcessoNegado';

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

          {/* Rotas de Fornecedores */}
          <Route
            path="/fornecedores"
            element={
              <ProtectedRoute>
                <ListaFornecedores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fornecedores/novo"
            element={
              <ProtectedRoute>
                <FormFornecedor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fornecedores/:id"
            element={
              <ProtectedRoute>
                <FormFornecedor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fornecedores/visualizar/:id"
            element={
              <ProtectedRoute>
                <VisualizarFornecedores />
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