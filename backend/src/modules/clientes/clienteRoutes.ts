import { Router } from 'express';
import ClienteController from './clienteController';
import { authenticate, authorize } from '../../middleware/authMiddleware';
import { UserRole } from '../auth/UserModel';
import { createClienteSchema, updateClienteSchema } from './ClienteModel';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticate);

// Rota para listar todos os clientes
router.get(
  '/',
  ClienteController.findAll
);

// Rota para obter um cliente pelo ID
router.get(
  '/:id',
  ClienteController.findById
);

// Rota para criar um novo cliente
// Somente administradores e master admins podem criar clientes
router.post(
  '/',
  authorize([UserRole.ADMIN, UserRole.MASTER_ADMIN]),
  // Iremos implementar a validação dentro do controller
  ClienteController.create
);

// Rota para atualizar um cliente
// Somente administradores e master admins podem atualizar clientes
router.put(
  '/:id',
  authorize([UserRole.ADMIN, UserRole.MASTER_ADMIN]),
  // Iremos implementar a validação dentro do controller
  ClienteController.update
);

// Rota para deletar um cliente
// Somente administradores e master admins podem deletar clientes
router.delete(
  '/:id',
  authorize([UserRole.ADMIN, UserRole.MASTER_ADMIN]),
  ClienteController.delete
);

export default router;