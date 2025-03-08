import { Router } from 'express';
import AuthController from './AuthController';
import { authenticate, authorize } from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validator';
import { createUserSchema, updateUserSchema, loginSchema, UserRole } from './UserModel';
import bcrypt from 'bcrypt';
import { supabase } from '../../config/database';

const router = Router();

// Rota de login (pública)
router.post('/login', validate(loginSchema), AuthController.login);

// Rota para o usuário logado acessar seus próprios dados
router.get('/me', authenticate, AuthController.me);

// Rotas protegidas que exigem autenticação
// Rota de registro - apenas admin ou master admin pode registrar novos usuários
router.post(
  '/register', 
  authenticate, 
  authorize([UserRole.ADMIN, UserRole.MASTER_ADMIN]), 
  validate(createUserSchema), 
  AuthController.register
);

// Listar usuários - apenas admin ou master admin pode listar
router.get(
  '/users', 
  authenticate, 
  authorize([UserRole.ADMIN, UserRole.MASTER_ADMIN]), 
  AuthController.listUsers
);

// Atualizar usuário - apenas admin ou master admin pode atualizar
router.put(
  '/users/:id', 
  authenticate, 
  authorize([UserRole.ADMIN, UserRole.MASTER_ADMIN]), 
  validate(updateUserSchema), 
  AuthController.updateUser
);

// Desativar usuário - apenas admin ou master admin pode desativar
router.delete(
  '/users/:id', 
  authenticate, 
  authorize([UserRole.ADMIN, UserRole.MASTER_ADMIN]), 
  AuthController.deactivateUser
);

// Rota temporária para criar um usuário admin (remova em produção!)
router.post('/register-admin', async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: 'admin_new@example.com',
        password: hashedPassword,
        name: 'Admin New',
        role: 'MASTER_ADMIN',
        active: true,
        created_at: new Date()
      })
      .select();
      
    if (error) {
      return res.status(400).json({ success: false, error });
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Admin user created successfully', 
      data,
      rawPassword: 'admin123',
      hashedPassword: hashedPassword
    });
  } catch (error) {
    next(error);
  }
});

export default router;