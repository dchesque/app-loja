# Sistema de Gestão Empresarial LOJA

Sistema de gestão empresarial completo com módulos para gerenciamento de vendas, clientes, fornecedores, funcionários e financeiro.

## Estrutura do Projeto

Este projeto está dividido em dois repositórios:

- **Backend**: API RESTful construída com Node.js, Express, TypeScript e Supabase
- **Frontend**: Interface do usuário construída com React, TypeScript e TailwindCSS

## Requisitos

- Node.js LTS 20
- npm 10+
- Conta no Supabase (https://supabase.com)

## Configuração Inicial

### Backend

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Renomeie o arquivo `.env.example` para `.env`
   - Substitua os valores de exemplo pelos valores reais da sua conta do Supabase

4. Crie as tabelas no Supabase:
   - Use o editor SQL do Supabase para criar as tabelas conforme definido na documentação
   - Ou execute os scripts SQL fornecidos na pasta `database/scripts`

5. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

6. O servidor estará disponível em: http://localhost:3001

### Frontend

1. Navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Renomeie o arquivo `.env.example` para `.env`
   - Ajuste o URL da API conforme necessário

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

5. A aplicação estará disponível em: http://localhost:3000

## Funcionalidades Implementadas

- **Autenticação e Controle de Acesso**
  - Login com JWT
  - Controle de acesso baseado em papéis (MASTER_ADMIN, ADMIN, USER)
  - Gerenciamento de usuários

- **Clientes**
  - Listagem com filtros e paginação
  - Cadastro e edição
  - Exclusão
  - Importação via arquivo XLSX

- **Dashboard**
  - Visão geral de vendas
  - Métricas principais
  - Listagem de vendas recentes

## Módulos Planejados

- **Vendas**
  - Cadastro de vendas
  - Relatórios
  - Comissões

- **Fornecedores**
  - Cadastro e gestão

- **Funcionários**
  - Cadastro e gestão
  - Gestão de cargos

- **Financeiro**
  - Contas a pagar
  - Plano de contas
  - Controle de cheques

## Tecnologias Utilizadas

### Backend
- Node.js com TypeScript
- Express
- Supabase (PostgreSQL)
- JWT para autenticação
- Joi para validação
- Winston para logging

### Frontend
- React com TypeScript
- TailwindCSS para estilização
- React Router para navegação
- Formik e Yup para formulários e validações
- Axios para requisições HTTP
- React Toastify para notificações

## Estrutura de Pastas

### Backend
```
backend/
├─ src/
│  ├─ config/         # Configurações (banco de dados, env, etc.)
│  ├─ middleware/     # Middlewares (auth, error handler, etc.)
│  ├─ modules/        # Módulos da aplicação
│  │  ├─ auth/        # Autenticação e usuários
│  │  ├─ clientes/    # Gestão de clientes
│  │  └─ ...
│  ├─ routes/         # Rotas da API
│  ├─ services/       # Serviços compartilhados
│  ├─ app.ts          # Configuração do Express
│  └─ server.ts       # Ponto de entrada
└─ ...
```

### Frontend
```
frontend/
├─ src/
│  ├─ assets/         # Recursos estáticos (imagens, etc.)
│  ├─ components/     # Componentes reutilizáveis
│  ├─ pages/          # Páginas da aplicação
│  │  ├─ Auth/        # Páginas de autenticação
│  │  ├─ Clientes/    # Páginas de clientes
│  │  └─ ...
│  ├─ services/       # Serviços (API, etc.)
│  ├─ store/          # Estado global (Context, etc.)
│  ├─ App.tsx         # Componente principal
│  └─ index.tsx       # Ponto de entrada
└─ ...
```

## Implantação

### Backend
1. Compile o TypeScript:
   ```bash
   npm run build
   ```
2. O código compilado estará na pasta `dist/`
3. Configure o ambiente de produção no Vercel ou similar

### Frontend
1. Construa a versão de produção:
   ```bash
   npm run build
   ```
2. Os arquivos estáticos serão gerados na pasta `build/`
3. Implante esta pasta no Vercel ou similar

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.