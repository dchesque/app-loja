import Joi from 'joi';

// Interface que representa o modelo de fornecedor
export interface Fornecedor {
  id?: string;
  codigo: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  inscricao_estadual?: string;
  telefone?: string;
  email?: string;
  contato?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  website?: string;
  categoria?: string;
  observacoes?: string;
  status: 'ativo' | 'inativo';
  created_at?: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
}

// Schema de validação para criação de fornecedor
export const createFornecedorSchema = Joi.object({
  codigo: Joi.string().allow('', null), // Agora é opcional
  razao_social: Joi.string()
    .required()
    .messages({
      'any.required': 'Razão Social é obrigatória',
      'string.empty': 'Razão Social não pode ser vazia'
    }),
  nome_fantasia: Joi.string()
    .required()
    .messages({
      'any.required': 'Nome Fantasia é obrigatório',
      'string.empty': 'Nome Fantasia não pode ser vazio'
    }),
  cnpj: Joi.string()
    .required()
    .pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$|^\d{14}$/)
    .messages({
      'any.required': 'CNPJ é obrigatório',
      'string.empty': 'CNPJ não pode ser vazio',
      'string.pattern.base': 'CNPJ deve estar no formato 00.000.000/0000-00 ou 00000000000000'
    }),
  inscricao_estadual: Joi.string().allow('', null),
  telefone: Joi.string()
    .pattern(/^\(\d{2}\)\s\d{4,5}\-\d{4}$|^\d{10,11}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'Telefone deve estar no formato (00) 0000-0000 ou (00) 00000-0000'
    }),
  email: Joi.string()
    .email()
    .allow('', null)
    .messages({
      'string.email': 'Email deve ser um endereço de email válido'
    }),
  contato: Joi.string().allow('', null),
  cep: Joi.string()
    .pattern(/^\d{5}\-\d{3}$|^\d{8}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'CEP deve estar no formato 00000-000 ou 00000000'
    }),
  endereco: Joi.string().allow('', null),
  numero: Joi.string().allow('', null),
  complemento: Joi.string().allow('', null),
  bairro: Joi.string().allow('', null),
  cidade: Joi.string().allow('', null),
  uf: Joi.string()
    .length(2)
    .allow('', null)
    .messages({
      'string.length': 'UF deve ter 2 caracteres'
    }),
  website: Joi.string()
    .uri()
    .allow('', null)
    .messages({
      'string.uri': 'Website deve ser uma URL válida'
    }),
  categoria: Joi.string().allow('', null),
  observacoes: Joi.string().allow('', null),
  status: Joi.string()
    .valid('ativo', 'inativo')
    .default('ativo')
    .messages({
      'any.only': 'Status deve ser ativo ou inativo'
    })
});

// Schema de validação para atualização de fornecedor
export const updateFornecedorSchema = Joi.object({
  codigo: Joi.string()
    .messages({
      'string.empty': 'Código não pode ser vazio'
    }),
  razao_social: Joi.string()
    .messages({
      'string.empty': 'Razão Social não pode ser vazia'
    }),
  nome_fantasia: Joi.string()
    .messages({
      'string.empty': 'Nome Fantasia não pode ser vazio'
    }),
  cnpj: Joi.string()
    .pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$|^\d{14}$/)
    .messages({
      'string.empty': 'CNPJ não pode ser vazio',
      'string.pattern.base': 'CNPJ deve estar no formato 00.000.000/0000-00 ou 00000000000000'
    }),
  inscricao_estadual: Joi.string().allow('', null),
  telefone: Joi.string()
    .pattern(/^\(\d{2}\)\s\d{4,5}\-\d{4}$|^\d{10,11}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'Telefone deve estar no formato (00) 0000-0000 ou (00) 00000-0000'
    }),
  email: Joi.string()
    .email()
    .allow('', null)
    .messages({
      'string.email': 'Email deve ser um endereço de email válido'
    }),
  contato: Joi.string().allow('', null),
  cep: Joi.string()
    .pattern(/^\d{5}\-\d{3}$|^\d{8}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'CEP deve estar no formato 00000-000 ou 00000000'
    }),
  endereco: Joi.string().allow('', null),
  numero: Joi.string().allow('', null),
  complemento: Joi.string().allow('', null),
  bairro: Joi.string().allow('', null),
  cidade: Joi.string().allow('', null),
  uf: Joi.string()
    .length(2)
    .allow('', null)
    .messages({
      'string.length': 'UF deve ter 2 caracteres'
    }),
  website: Joi.string()
    .uri()
    .allow('', null)
    .messages({
      'string.uri': 'Website deve ser uma URL válida'
    }),
  categoria: Joi.string().allow('', null),
  observacoes: Joi.string().allow('', null),
  status: Joi.string()
    .valid('ativo', 'inativo')
    .messages({
      'any.only': 'Status deve ser ativo ou inativo'
    })
});

// Schema para validação de parâmetros de busca
export const fornecedorQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
  razao_social: Joi.string().allow('', null),
  nome_fantasia: Joi.string().allow('', null),
  cnpj: Joi.string().allow('', null),
  codigo: Joi.string().allow('', null),
  cidade: Joi.string().allow('', null),
  uf: Joi.string().length(2).allow('', null),
  categoria: Joi.string().allow('', null),
  status: Joi.string().valid('ativo', 'inativo').allow('', null),
  orderBy: Joi.string().valid('razao_social', 'codigo', 'created_at').default('created_at'),
  orderDirection: Joi.string().valid('asc', 'desc').default('desc')
});