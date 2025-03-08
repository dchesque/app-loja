const fs = require('fs');
const path = require('path');

// Lista de arquivos para criar
const files = [
  'src/config/database.ts',
  'src/config/env.ts',
  'src/config/swagger.ts',
  'src/middleware/authMiddleware.ts',
  'src/middleware/errorHandler.ts',
  'src/middleware/validator.ts',
  'src/app.ts',
  'src/server.ts',
  'src/routes/index.ts',
  'src/services/supabaseService.ts',
  'src/modules/auth/UserModel.ts',
  'src/modules/auth/AuthController.ts',
  'src/modules/auth/AuthRoutes.ts',
  'src/modules/clientes/ClienteModel.ts',
  'src/modules/clientes/clienteController.ts',
  'src/modules/clientes/clienteRoutes.ts',
  'src/modules/fornecedores/FornecedorModel.ts',
  'src/modules/fornecedores/fornecedorController.ts',
  'src/modules/fornecedores/fornecedorRoutes.ts',
  'src/modules/funcionarios/CargoModel.ts',
  'src/modules/funcionarios/FuncionarioModel.ts',
  'src/modules/funcionarios/funcionarioController.ts',
  'src/modules/funcionarios/funcionarioRoutes.ts',
  'src/modules/financeiro/contasPagar/ContasPagarController.ts',
  'src/modules/financeiro/contasPagar/contasPagarRoutes.ts',
  'src/modules/financeiro/contasPagar/ImportarLote.ts',
  'src/modules/financeiro/planoContas/PlanoContasModel.ts',
  'src/modules/financeiro/planoContas/planoContasController.ts',
  'src/modules/financeiro/planoContas/planoContasRoutes.ts',
  'src/modules/financeiro/cheques/ChequeModel.ts',
  'src/modules/financeiro/cheques/chequesController.ts',
  'src/modules/financeiro/cheques/chequesRoutes.ts'
];

// Cria diretórios recursivamente se não existirem
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Cria cada arquivo
files.forEach(file => {
  const filePath = path.join(__dirname, file);
  ensureDirectoryExistence(filePath);
  fs.writeFileSync(filePath, '');
  console.log(`Arquivo criado: ${file}`);
});

console.log('Todos os arquivos foram criados com sucesso!');