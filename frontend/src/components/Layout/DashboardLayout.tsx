import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

// ícones (você pode importar de bibliotecas como @heroicons/react)
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ClientesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const VendasIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const FornecedoresIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const FinanceiroIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RelatoriosIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ConfigIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface MenuItem {
  name: string;
  path: string;
  icon: React.FC;
  roles?: string[];
}

interface SubMenu {
  name: string;
  icon: React.FC;
  items: MenuItem[];
  roles?: string[];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const mainMenuItems: (MenuItem | SubMenu)[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: DashboardIcon,
    },
    {
      name: 'Clientes',
      path: '/clientes',
      icon: ClientesIcon,
    },
    {
      name: 'Vendas',
      path: '/vendas',
      icon: VendasIcon,
    },
    {
      name: 'Fornecedores',
      path: '/fornecedores',
      icon: FornecedoresIcon,
    },
    {
      name: 'Financeiro',
      icon: FinanceiroIcon,
      items: [
        {
          name: 'Contas a Pagar',
          path: '/financeiro/contas-pagar',
          icon: () => null,
        },
        {
          name: 'Plano de Contas',
          path: '/financeiro/plano-contas',
          icon: () => null,
        },
        {
          name: 'Cheques',
          path: '/financeiro/cheques',
          icon: () => null,
        },
      ],
    },
    {
      name: 'Relatórios',
      path: '/relatorios',
      icon: RelatoriosIcon,
    },
    {
      name: 'Configurações',
      path: '/configuracoes',
      icon: ConfigIcon,
      roles: ['MASTER_ADMIN', 'ADMIN'],
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Verificar se o item deve ser exibido com base na role do usuário
  const shouldShowMenuItem = (item: MenuItem | SubMenu) => {
    if (!item.roles || !item.roles.length) return true;
    return user && item.roles.includes(user.role);
  };

  // Verificar se o item está ativo
  const isMenuItemActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white shadow-md transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className={`${isSidebarOpen ? 'block' : 'hidden'} text-xl font-bold text-primary-600`}>
            LOJA
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isSidebarOpen ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7' : 'M13 5l7 7-7 7M5 5l7 7-7 7'}
              />
            </svg>
          </button>
        </div>

        <nav className="mt-6">
          <ul>
            {mainMenuItems.map((item, index) => {
              if (!shouldShowMenuItem(item)) return null;

              if ('items' in item) {
                // É um submenu
                const submenu = item as SubMenu;
                return (
                  <li key={index} className="px-4 py-2">
                    <div className="flex items-center mb-2 text-gray-600 hover:text-primary-600">
                      <span className="mr-3">{<item.icon />}</span>
                      {isSidebarOpen && <span>{item.name}</span>}
                    </div>
                    {isSidebarOpen && (
                      <ul className="ml-6">
                        {submenu.items.map((subItem, subIndex) => (
                          <li key={subIndex} className="mb-2">
                            <Link
                              to={subItem.path}
                              className={`flex items-center py-2 px-4 ${
                                isMenuItemActive(subItem.path)
                                  ? 'text-primary-700 bg-primary-50 rounded-md'
                                  : 'text-gray-600 hover:text-primary-700'
                              }`}
                            >
                              <span>{subItem.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              } else {
                // É um item de menu normal
                const menuItem = item as MenuItem;
                return (
                  <li key={index} className="px-4 py-2">
                    <Link
                      to={menuItem.path}
                      className={`flex items-center py-2 px-4 rounded-md ${
                        isMenuItemActive(menuItem.path)
                          ? 'text-primary-700 bg-primary-50'
                          : 'text-gray-600 hover:text-primary-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">{<menuItem.icon />}</span>
                      {isSidebarOpen && <span>{menuItem.name}</span>}
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">
                {mainMenuItems.find(
                  (item) =>
                    !('items' in item) &&
                    (location.pathname === (item as MenuItem).path ||
                      location.pathname.startsWith(`${(item as MenuItem).path}/`))
                )?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => {}}
                >
                  <div className="mr-3 text-right">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                    {user?.name.charAt(0)}
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;