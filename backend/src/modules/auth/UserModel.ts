import Joi from 'joi';

// Enum com roles disponíveis
export enum UserRole {
  MASTER_ADMIN = 'MASTER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

// Interface que representa o modelo de usuário
export interface User {
  id?: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

// Schema de validação para criação de usuário
export const createUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Formato de e-mail inválido',
      'any.required': 'E-mail é obrigatório'
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'A senha deve ter pelo menos 8 caracteres',
      'any.required': 'Senha é obrigatória'
    }),
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Nome é obrigatório'
    }),
  role: Joi.string()
    .valid(
      UserRole.MASTER_ADMIN, 
      UserRole.ADMIN, 
      UserRole.USER
    )
    .required()
    .messages({
      'any.only': 'Papel deve ser MASTER_ADMIN, ADMIN ou USER',
      'any.required': 'Papel é obrigatório'
    }),
  active: Joi.boolean().default(true)
});

// Schema de validação para atualização de usuário
export const updateUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .messages({
      'string.email': 'Formato de e-mail inválido'
    }),
  password: Joi.string()
    .min(8)
    .messages({
      'string.min': 'A senha deve ter pelo menos 8 caracteres'
    }),
  name: Joi.string(),
  role: Joi.string()
    .valid(
      UserRole.MASTER_ADMIN, 
      UserRole.ADMIN, 
      UserRole.USER
    )
    .messages({
      'any.only': 'Papel deve ser MASTER_ADMIN, ADMIN ou USER'
    }),
  active: Joi.boolean()
});

// Schema de validação para login
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Formato de e-mail inválido',
      'any.required': 'E-mail é obrigatório'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Senha é obrigatória'
    })
});