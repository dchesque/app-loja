import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import fornecedorService, { Fornecedor } from '../../services/fornecedorService';

const VisualizarFornecedores: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFornecedor = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const data = await fornecedorService.obterFornecedorPorId(parseInt(id));
          setFornecedor(data);
        }
      } catch (error) {
        console.error('Erro ao carregar fornecedor:', error);
        toast.error('Não foi possível carregar os dados do fornecedor.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFornecedor();
  }, [id]);

  // Formatar CNPJ para exibição
  const formatCnpj = (cnpj: string | undefined) => {
    if (!cnpj) return '';
    
    // Remove caracteres não numéricos
    const numericCnpj = cnpj.replace(/\D/g, '');
    
    // Verifica se tem 14 dígitos
    if (numericCnpj.length !== 14) return cnpj;
    
    // Formata como XX.XXX.XXX/XXXX-XX
    return `${numericCnpj.substring(0, 2)}.${numericCnpj.substring(2, 5)}.${numericCnpj.substring(5, 8)}/${numericCnpj.substring(8, 12)}-${numericCnpj.substring(12)}`;
  };
  
  // Formatar data para exibição
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto">
          <div className="bg-white rounded-lg shadow p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!fornecedor) {
    return (
      <DashboardLayout>
        <div className="container mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center text-danger-600 mb-4">
              Fornecedor não encontrado.
            </div>
            <div className="flex justify-center">
              <Link 
                to="/fornecedores" 
                className="btn btn-primary"
              >
                Voltar para a lista
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Detalhes do Fornecedor</h1>
          <div className="flex space-x-2">
            <Link 
              to="/fornecedores" 
              className="btn btn-outline"
            >
              Voltar
            </Link>
            <Link 
              to={`/fornecedores/${id}`} 
              className="btn btn-primary"
            >
              Editar
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{fornecedor.razao_social}</h2>
                <p className="text-gray-600">{fornecedor.nome_fantasia}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                fornecedor.status === 'ativo' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {fornecedor.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Informações Gerais</h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Código:</span>
                    <span className="font-medium">{fornecedor.codigo}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">CNPJ:</span>
                    <span className="font-medium">{formatCnpj(fornecedor.cnpj)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Inscrição Estadual:</span>
                    <span className="font-medium">{fornecedor.inscricao_estadual || 'Não informada'}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">
                      {fornecedor.email ? (
                        <a href={`mailto:${fornecedor.email}`} className="text-primary-600 hover:underline">
                          {fornecedor.email}
                        </a>
                      ) : (
                        'Não informado'
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Telefone:</span>
                    <span className="font-medium">{fornecedor.telefone || 'Não informado'}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Contato:</span>
                    <span className="font-medium">{fornecedor.contato || 'Não informado'}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Website:</span>
                    <span className="font-medium">
                      {fornecedor.website ? (
                        <a href={fornecedor.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                          {fornecedor.website}
                        </a>
                      ) : (
                        'Não informado'
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Categoria:</span>
                    <span className="font-medium">{fornecedor.categoria || 'Não informada'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Endereço</h3>
                {fornecedor.endereco ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-2">
                      {fornecedor.endereco}, {fornecedor.numero || 'S/N'}
                      {fornecedor.complemento && ` - ${fornecedor.complemento}`}
                    </p>
                    <p className="mb-2">
                      {fornecedor.bairro && `${fornecedor.bairro}, `}
                      {fornecedor.cidade || ''}{fornecedor.cidade && fornecedor.uf ? ' - ' : ''}
                      {fornecedor.uf || ''}
                    </p>
                    <p>{fornecedor.cep && `CEP: ${fornecedor.cep}`}</p>
                  </div>
                ) : (
                  <div className="text-gray-500 italic">
                    Nenhum endereço cadastrado para este fornecedor.
                  </div>
                )}
                
                <h3 className="text-lg font-medium mt-6 mb-4">Observações</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {fornecedor.observacoes ? (
                    <p>{fornecedor.observacoes}</p>
                  ) : (
                    <p className="text-gray-500 italic">Nenhuma observação registrada.</p>
                  )}
                </div>
                
                <h3 className="text-lg font-medium mt-6 mb-4">Informações de Registro</h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Data de Cadastro:</span>
                    <span className="font-medium">{formatDate(fornecedor.created_at)}</span>
                  </div>
                  {fornecedor.updated_at && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Última Atualização:</span>
                      <span className="font-medium">{formatDate(fornecedor.updated_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VisualizarFornecedores;