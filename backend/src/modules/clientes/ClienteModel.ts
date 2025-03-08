import Joi from 'joi';

// Interface que representa o modelo de cliente
export interface Cliente {
  id?: string;
  codigo: string;
  loja: string;
  nome: string;
  cpf: string;
  data_nascimento?: Date;
  nome_cliente: string;
  classificacao1?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  tipo_res?: string;
  telefone?: string;
  celular?: string;
  observacoes?: string;
  created_at?: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
}

// Schema de validação para criação de cliente
export const createClienteSchema = Joi.object({
  codigo: Joi.string()
    .required()
    .messages({
      'any.required': 'Código é obrigatório',
      'string.empty': 'Código não pode ser vazio'
    }),
  loja: Joi.string()
    .required()
    .messages({
      'any.required': 'Loja é obrigatória',
      'string.empty': 'Loja não pode ser vazia'
    }),
  nome: Joi.string()
    .required()
    .messages({
      'any.required': 'Nome é obrigatório',
      'string.empty': 'Nome não pode ser vazio'
    }),
  cpf: Joi.string()
    .required()
    .pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$|^\d{11}$/)
    .messages({
      'any.required': 'CPF é obrigatório',
      'string.empty': 'CPF não pode ser vazio',
      'string.pattern.base': 'CPF deve estar no formato 000.000.000-00 ou 00000000000'
    }),
  data_nascimento: Joi.date()
    .iso()
    .allow(null)
    .messages({
      'date.base': 'Data de nascimento deve ser uma data válida',
      'date.format': 'Data de nascimento deve estar no formato ISO'
    }),
  nome_cliente: Joi.string()
    .required()
    .messages({
      'any.required': 'Nome do cliente é obrigatório',
      'string.empty': 'Nome do cliente não pode ser vazio'
    }),
  classificacao1: Joi.string().allow('', null),
  cep: Joi.string()
    .pattern(/^\d{5}\-\d{3}$|^\d{8}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'CEP deve estar no formato 00000-000 ou 00000000'
    }),
  endereco: Joi.string().allow('', null),
  numero: Joi.string().allow('', null),
  bairro: Joi.string().allow('', null),
  cidade: Joi.string().allow('', null),
  uf: Joi.string()
    .length(2)
    .allow('', null)
    .messages({
      'string.length': 'UF deve ter 2 caracteres'
    }),
  tipo_res: Joi.string().allow('', null),
  telefone: Joi.string()
    .pattern(/^\(\d{2}\)\s\d{4,5}\-\d{4}$|^\d{10,11}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'Telefone deve estar no formato (00) 0000-0000 ou (00) 00000-0000'
    }),
  celular: Joi.string()
    .pattern(/^\(\d{2}\)\s\d{5}\-\d{4}$|^\d{11}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'Celular deve estar no formato (00) 00000-0000 ou 00000000000'
    }),
  observacoes: Joi.string().allow('', null)
});

// Schema de validação para atualização de cliente
export const updateClienteSchema = Joi.object({
  codigo: Joi.string()
    .messages({
      'string.empty': 'Código não pode ser vazio'
    }),
  loja: Joi.string()
    .messages({
      'string.empty': 'Loja não pode ser vazia'
    }),
  nome: Joi.string()
    .messages({
      'string.empty': 'Nome não pode ser vazio'
    }),
  cpf: Joi.string()
    .pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$|^\d{11}$/)
    .messages({
      'string.empty': 'CPF não pode ser vazio',
      'string.pattern.base': 'CPF deve estar no formato 000.000.000-00 ou 00000000000'
    }),
  data_nascimento: Joi.date()
    .iso()
    .allow(null)
    .messages({
      'date.base': 'Data de nascimento deve ser uma data válida',
      'date.format': 'Data de nascimento deve estar no formato ISO'
    }),
  nome_cliente: Joi.string()
    .messages({
      'string.empty': 'Nome do cliente não pode ser vazio'
    }),
  classificacao1: Joi.string().allow('', null),
  cep: Joi.string()
    .pattern(/^\d{5}\-\d{3}$|^\d{8}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'CEP deve estar no formato 00000-000 ou 00000000'
    }),
  endereco: Joi.string().allow('', null),
  numero: Joi.string().allow('', null),
  bairro: Joi.string().allow('', null),
  cidade: Joi.string().allow('', null),
  uf: Joi.string()
    .length(2)
    .allow('', null)
    .messages({
      'string.length': 'UF deve ter 2 caracteres'
    }),
  tipo_res: Joi.string().allow('', null),
  telefone: Joi.string()
    .pattern(/^\(\d{2}\)\s\d{4,5}\-\d{4}$|^\d{10,11}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'Telefone deve estar no formato (00) 0000-0000 ou (00) 00000-0000'
    }),
  celular: Joi.string()
    .pattern(/^\(\d{2}\)\s\d{5}\-\d{4}$|^\d{11}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'Celular deve estar no formato (00) 00000-0000 ou 00000000000'
    }),
  observacoes: Joi.string().allow('', null)
});

// Schema para validação de parâmetros de busca
export const clienteQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
  nome: Joi.string().allow('', null),
  cpf: Joi.string().allow('', null),
  codigo: Joi.string().allow('', null),
  loja: Joi.string().allow('', null),
  cidade: Joi.string().allow('', null),
  uf: Joi.string().length(2).allow('', null),
  orderBy: Joi.string().valid('nome', 'codigo', 'created_at').default('created_at'),
  orderDirection: Joi.string().valid('asc', 'desc').default('desc')
});