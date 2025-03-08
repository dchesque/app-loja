import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../../config/database';
import env from '../../config/env';
import { AppError } from '../../middleware/errorHandler';
import { User, UserRole } from './UserModel';

class AuthController {
  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Registra um novo usuário
   *     tags: [Autenticação]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               name:
   *                 type: string
   *               role:
   *                 type: string
   *                 enum: [MASTER_ADMIN, ADMIN, USER]
   *     responses:
   *       201:
   *         description: Usuário criado com sucesso
   *       400:
   *         description: Dados inválidos
   *       409:
   *         description: E-mail já está em uso
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name, role } = req.body;

      // Verificar se já existe um usuário com este e-mail
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new AppError('E-mail já está em uso', 409);
      }

      // Apenas MASTER_ADMIN pode criar outros MASTER_ADMIN
      if (role === UserRole.MASTER_ADMIN && req.user?.role !== UserRole.MASTER_ADMIN) {
        throw new AppError('Você não tem permissão para criar um usuário MASTER_ADMIN', 403);
      }

      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Criar usuário
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          email,
          password: hashedPassword,
          name,
          role,
          active: true,
          created_at: new Date(),
          created_by: req.user?.id || null
        })
        .select();

      if (error) {
        throw new AppError(`Erro ao criar usuário: ${error.message}`, 400);
      }

      // Não retornar a senha no response
      const userWithoutPassword = {
        ...newUser[0],
        password: undefined
      };

      res.status(201).json({
        success: true,
        data: userWithoutPassword
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Autentica um usuário
   *     tags: [Autenticação]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login bem-sucedido
   *       401:
   *         description: Credenciais inválidas
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      console.log('Login attempt:', email);

      // Buscar usuário pelo e-mail
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        console.log('User not found or error:', error);
        throw new AppError('Credenciais inválidas', 401);
      }

      // Verificar se usuário está ativo
      if (!user.active) {
        console.log('User account is deactivated');
        throw new AppError('Conta desativada. Entre em contato com o administrador.', 401);
      }

      console.log('User found, verifying password');
      
      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('Invalid password');
        throw new AppError('Credenciais inválidas', 401);
      }

      console.log('Password valid, generating token');

      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id, role: user.role },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
      );

      // Atualizar último login
      await supabase
        .from('users')
        .update({ last_login: new Date() })
        .eq('id', user.id);

      // Não retornar a senha no response
      const userWithoutPassword = {
        ...user,
        password: undefined
      };

      console.log('Login successful for user:', email);

      res.status(200).json({
        success: true,
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/me:
   *   get:
   *     summary: Obtém informações do usuário atual
   *     tags: [Autenticação]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Informações do usuário
   *       401:
   *         description: Não autenticado
   */
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Não autenticado', 401);
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, name, role, active, created_at, last_login')
        .eq('id', req.user.id)
        .single();

      if (error || !user) {
        throw new AppError('Usuário não encontrado', 404);
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/users:
   *   get:
   *     summary: Lista todos os usuários (apenas para ADMIN e MASTER_ADMIN)
   *     tags: [Autenticação]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de usuários
   *       403:
   *         description: Acesso não autorizado
   */
  async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data: users, error, count } = await supabase
        .from('users')
        .select('id, email, name, role, active, created_at, last_login', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) {
        throw new AppError(`Erro ao listar usuários: ${error.message}`, 400);
      }

      res.status(200).json({
        success: true,
        count,
        data: users,
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil((count || 0) / pageSize),
          total: count
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/users/{id}:
   *   put:
   *     summary: Atualiza um usuário
   *     tags: [Autenticação]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Usuário atualizado
   *       403:
   *         description: Acesso não autorizado
   */
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { password, ...updateData } = req.body;

      // Verificar se o usuário existe
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', id)
        .single();

      if (userError || !existingUser) {
        throw new AppError('Usuário não encontrado', 404);
      }

      // Apenas MASTER_ADMIN pode atualizar outro MASTER_ADMIN
      if (
        existingUser.role === UserRole.MASTER_ADMIN && 
        req.user?.role !== UserRole.MASTER_ADMIN
      ) {
        throw new AppError('Você não tem permissão para modificar um usuário MASTER_ADMIN', 403);
      }

      // Preparar dados para atualização
      const dataToUpdate: Partial<User> = {
        ...updateData,
        updated_at: new Date(),
        updated_by: req.user?.id
      };

      // Se houver senha, fazer hash
      if (password) {
        const salt = await bcrypt.genSalt(10);
        dataToUpdate.password = await bcrypt.hash(password, salt);
      }

      // Atualizar usuário
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(dataToUpdate)
        .eq('id', id)
        .select('id, email, name, role, active, created_at, updated_at');

      if (error) {
        throw new AppError(`Erro ao atualizar usuário: ${error.message}`, 400);
      }

      res.status(200).json({
        success: true,
        data: updatedUser[0]
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/users/{id}:
   *   delete:
   *     summary: Desativa um usuário (não exclui)
   *     tags: [Autenticação]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Usuário desativado
   *       403:
   *         description: Acesso não autorizado
   */
  async deactivateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Verificar se o usuário existe
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', id)
        .single();

      if (userError || !existingUser) {
        throw new AppError('Usuário não encontrado', 404);
      }

      // Não permitir que um MASTER_ADMIN seja desativado por não MASTER_ADMIN
      if (
        existingUser.role === UserRole.MASTER_ADMIN && 
        req.user?.role !== UserRole.MASTER_ADMIN
      ) {
        throw new AppError('Você não tem permissão para desativar um usuário MASTER_ADMIN', 403);
      }

      // Desativar (não excluir) o usuário
      const { data, error } = await supabase
        .from('users')
        .update({
          active: false,
          updated_at: new Date(),
          updated_by: req.user?.id
        })
        .eq('id', id)
        .select('id, email, name, role, active, created_at, updated_at');

      if (error) {
        throw new AppError(`Erro ao desativar usuário: ${error.message}`, 400);
      }

      res.status(200).json({
        success: true,
        message: 'Usuário desativado com sucesso',
        data: data[0]
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();