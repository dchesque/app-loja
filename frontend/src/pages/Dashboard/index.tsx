import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useAuth } from '../../store/AuthContext';

// Importaremos os serviços quando estiverem implementados
// import clienteService from '../../services/clienteService';
// import vendasService from '../../services/vendasService';

interface DashboardStats {
  totalVendas: string;
  variacaoVendas: string;
  produtosVendidos: number;
  clientesAtivos: number;
  novoClientes: number;
  mediaDiaria: string;
}

// Dados temporários para visualização
const initialStats: DashboardStats = {
  totalVendas: 'R$ 45.231,89',
  variacaoVendas: '+20,1%',
  produtosVendidos: 573,
  clientesAtivos: 2350,
  novoClientes: 180,
  mediaDiaria: 'R$ 1.509,40'
};

// Dados de vendas recentes
const vendasRecentes = [
  { id: 'MM', nome: 'Maria Mendes', email: 'maria.mendes@email.com', valor: 'R$ 1.999,00' },
  { id: 'JD', nome: 'João Dias', email: 'joao.dias@email.com', valor: 'R$ 399,00' },
  { id: 'AS', nome: 'Ana Silva', email: 'ana.silva@email.com', valor: 'R$ 299,00' },
  { id: 'LS', nome: 'Lucas Santos', email: 'lucas.santos@email.com', valor: 'R$ 799,00' },
  { id: 'CO', nome: 'Clara Oliveira', email: 'clara.oliveira@email.com', valor: 'R$ 699,00' }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Aqui faríamos chamadas para APIs para obter dados reais
    // Por enquanto, simulamos um carregamento
    const fetchData = async () => {
      try {
        // Simulando uma chamada de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Em uma implementação real, você carregaria os dados de uma API
        // const vendas = await vendasService.getDashboardStats();
        // const clientes = await clienteService.getClientesStats();
        
        // setStats({
        //   totalVendas: vendas.total,
        //   variacaoVendas: vendas.variacao,
        //   produtosVendidos: vendas.produtosVendidos,
        //   clientesAtivos: clientes.ativos,
        //   novoClientes: clientes.novos,
        //   mediaDiaria: vendas.mediaDiaria
        // });

        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        {/* Cabeçalho com mensagem de boas-vindas */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Olá, {user?.name}!</h1>
          <p className="text-gray-600">Bem-vindo ao seu painel de controle</p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Vendas Totais</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalVendas}</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                {stats.variacaoVendas} em relação ao mês anterior
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Produtos Vendidos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.produtosVendidos}</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                +201 desde a última semana
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.clientesAtivos}</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                +{stats.novoClientes} novos clientes
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Média Diária</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.mediaDiaria}</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                +8,1% em relação à média anterior
              </span>
            </div>
          </div>
        </div>

        {/* Gráfico de vendas por mês (simulação) */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Visão Geral</h2>
            
            {/* Aqui iria um componente de gráfico real como Recharts */}
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Gráfico de vendas por mês</p>
              {/* Em uma implementação real, usaríamos algo como:
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vendasPorMes}>
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="valor" stroke="#c39a57" />
                </LineChart>
              </ResponsiveContainer>
              */}
            </div>
          </div>
        </div>

        {/* Vendas Recentes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Vendas Recentes</h2>
              <p className="text-sm text-gray-600">Você fez 265 vendas este mês.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  {vendasRecentes.map((venda) => (
                    <tr key={venda.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-medium">
                            {venda.id}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{venda.nome}</div>
                            <div className="text-sm text-gray-500">{venda.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {venda.valor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;