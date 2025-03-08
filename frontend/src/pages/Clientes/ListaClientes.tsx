import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import clienteService, { Cliente, ClienteFilter } from '../../services/clienteService';

const ListaClientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtros, setFiltros] = useState<ClienteFilter>({
    page: 1,
    pageSize: 10
  });
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Carregar clientes com base nos filtros atuais
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setIsLoading(true);
        const response = await clienteService.listarClientes(filtros);
        setClientes(response.data);
        setTotalClientes(response.count || 0);
        setTotalPages(response.pagination?.pageCount || 1);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        toast.error('Não foi possível carregar a lista de clientes.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientes();
  }, [filtros]);

  // Função para atualizar filtros
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset para a primeira página ao filtrar
    }));
  };

  // Funções para paginação
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setFiltros(prev => ({
        ...prev,
        page: newPage
      }));
    }
  };

  // Função para excluir cliente
  const handleDeleteCliente = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await clienteService.excluirCliente(id);
        toast.success('Cliente excluído com sucesso');
        // Atualizar a lista após excluir
        setClientes(clientes.filter(cliente => cliente.id !== id));
        // Se for o último item da página, voltar para a página anterior
        if (clientes.length === 1 && filtros.page && filtros.page > 1) {
          handlePageChange(filtros.page - 1);
        } else {
          // Caso contrário, apenas recarregar a página atual
          const response = await clienteService.listarClientes(filtros);
          setClientes(response.data);
          setTotalClientes(response.count || 0);
        }
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        toast.error('Não foi possível excluir o cliente.');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
          <Link 
            to="/clientes/novo" 
            className="btn btn-primary flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Novo Cliente
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="nome" className="form-label">Nome</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={filtros.nome || ''}
                onChange={handleFilterChange}
                className="form-input"
                placeholder="Buscar por nome"
              />
            </div>
            <div>
              <label htmlFor="cpf" className="form-label">CPF</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={filtros.cpf || ''}
                onChange={handleFilterChange}
                className="form-input"
                placeholder="Buscar por CPF"
              />
            </div>
            <div>
              <label htmlFor="cidade" className="form-label">Cidade</label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={filtros.cidade || ''}
                onChange={handleFilterChange}
                className="form-input"
                placeholder="Buscar por cidade"
              />
            </div>
            <div>
              <label htmlFor="uf" className="form-label">UF</label>
              <input
                type="text"
                id="uf"
                name="uf"
                value={filtros.uf || ''}
                onChange={handleFilterChange}
                className="form-input"
                placeholder="UF"
                maxLength={2}
              />
            </div>
          </div>
        </div>

        {/* Tabela de Clientes */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-6 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : clientes.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Código
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CPF
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cidade/UF
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contato
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clientes.map((cliente) => (
                      <tr key={cliente.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{cliente.codigo}</div>
                          <div className="text-sm text-gray-500">{cliente.loja}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{cliente.nome}</div>
                          <div className="text-sm text-gray-500">{cliente.nome_cliente}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{cliente.cpf}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {cliente.cidade}{cliente.cidade && cliente.uf ? '/' : ''}{cliente.uf}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{cliente.telefone || cliente.celular}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            to={`/clientes/${cliente.id}`}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => cliente.id && handleDeleteCliente(cliente.id)}
                            className="text-danger-600 hover:text-danger-900"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => filtros.page && handlePageChange(filtros.page - 1)}
                    disabled={filtros.page === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      filtros.page === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => filtros.page && handlePageChange(filtros.page + 1)}
                    disabled={filtros.page === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      filtros.page === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Próximo
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{((filtros.page! - 1) * filtros.pageSize!) + 1}</span> a{' '}
                      <span className="font-medium">
                        {Math.min(filtros.page! * filtros.pageSize!, totalClientes)}
                      </span>{' '}
                      de <span className="font-medium">{totalClientes}</span> resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={filtros.page === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          filtros.page === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Primeira</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => filtros.page && handlePageChange(filtros.page - 1)}
                        disabled={filtros.page === 1}
                        className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          filtros.page === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Anterior</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {/* Números de página */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                        let pageNumber: number;
                        if (totalPages <= 5) {
                          // Se tiver 5 ou menos páginas, mostrar todas
                          pageNumber = index + 1;
                        } else if (filtros.page && filtros.page <= 3) {
                          // Se estiver nas primeiras 3 páginas, mostrar 1-5
                          pageNumber = index + 1;
                        } else if (filtros.page && filtros.page >= totalPages - 2) {
                          // Se estiver nas últimas 3 páginas, mostrar as últimas 5
                          pageNumber = totalPages - 4 + index;
                        } else {
                          // Caso contrário, mostrar 2 antes e 2 depois da página atual
                          pageNumber = (filtros.page || 1) - 2 + index;
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              filtros.page === pageNumber
                                ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => filtros.page && handlePageChange(filtros.page + 1)}
                        disabled={filtros.page === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          filtros.page === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Próximo</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={filtros.page === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          filtros.page === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Última</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">Nenhum cliente encontrado. Tente outros filtros ou</p>
              <Link to="/clientes/novo" className="text-primary-600 hover:text-primary-800">
                cadastre um novo cliente
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ListaClientes;