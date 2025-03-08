import { Router } from 'express';
import FornecedorController from './fornecedorController';
import { authenticate, authorize } from '../../middleware/authMiddleware';
import { UserRole } from '../auth/UserModel';
import { validateQuery } from '../../middleware/validator';
import { fornecedorQuerySchema } from './FornecedorModel';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticate);

// Rota para listar todos os fornecedores
router.get(
  '/',
  validateQuery(fornecedorQuerySchema),
  FornecedorController.findAll
);

// Rota para obter um fornecedor pelo ID
router.get(
  '/:id',
  FornecedorController.findById
);

// Rota para criar um novo fornecedor
// Somente administradores e master admins podem criar fornecedores
router.post(
  '/',
  authorize([UserRole.ADMIN, UserRole.MASTER_ADMIN]),
  // A validação é feita dentro do controller
  FornecedorController.create
);

// Rota para atualizar um fornecedor
// Somente administradores e master admins podem atualizar fornecedores
router.put(
  '/:id',
  authorize([UserRole.ADMIN, UserRole.MASTER_ADMIN]),
  // A validação é feita dentro do controller
  FornecedorController.update
);

// Rota para deletar um fornecedor
// Somente administradores e master admins podem deletar fornecedores
router.delete(
  '/:id',
  authorize([UserRole.ADMIN, UserRole.MASTER_ADMIN]),
  FornecedorController.delete
);

export default router;