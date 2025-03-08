import { Request, Response, NextFunction } from 'express';
import supabaseService from '../../services/supabaseService';
import { AppError, logger } from '../../middleware/errorHandler';
import { Fornecedor, createFornecedorSchema, updateFornecedorSchema } from './FornecedorModel';

class FornecedorController {
  /**
   * @swagger
   * /api/fornecedores:
   *   post:
   *     summary: Cria um novo fornecedor
   *     tags: [Fornecedores]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Fornecedor'
   *     responses:
   *       201:
   *         description: Fornecedor criado com sucesso
   *       400:
   *         description: Dados inválidos
   *       409:
   *         description: Fornecedor já existe com este CNPJ ou código
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Endpoint de criação de fornecedor acessado');
      // Validação manual do corpo da requisição
      const { error } = createFornecedorSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errorMessage = error.details
          .map((detail) => detail.message)
          .join(', ');
        
        throw new AppError(errorMessage, 400);
      }

      const fornecedorData: Fornecedor = req.body;
      
      // Verificar se já existe um fornecedor com o mesmo CNPJ
      const { data: existingFornecedorByCnpj } = await supabaseService.select('fornecedores', '*', {
        filters: { cnpj: fornecedorData.cnpj }
      });

      if (existingFornecedorByCnpj && existingFornecedorByCnpj.length > 0) {
        throw new AppError('Fornecedor já existe com este CNPJ', 409);
      }

      // Verificar se já existe um fornecedor com o mesmo código
      const { data: existingFornecedorByCodigo } = await supabaseService.select('fornecedores', '*', {
        filters: { codigo: fornecedorData.codigo }
      });

      if (existingFornecedorByCodigo && existingFornecedorByCodigo.length > 0) {
        throw new AppError('Fornecedor já existe com este código', 409);
      }

      // Adicionar informações de criação
      const newFornecedor = {
        ...fornecedorData,
        created_at: new Date(),
        created_by: req.user?.id
      };

      // Inserir o fornecedor no banco de dados
      const fornecedor = await supabaseService.insert('fornecedores', newFornecedor);

      res.status(201).json({
        success: true,
        data: fornecedor[0]
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/fornecedores:
   *   get:
   *     summary: Lista todos os fornecedores
   *     tags: [Fornecedores]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Página a ser exibida
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Quantidade de itens por página
   *       - in: query
   *         name: razao_social
   *         schema:
   *           type: string
   *         description: Filtro por razão social
   *       - in: query
   *         name: nome_fantasia
   *         schema:
   *           type: string
   *         description: Filtro por nome fantasia
   *       - in: query
   *         name: cnpj
   *         schema:
   *           type: string
   *         description: Filtro por CNPJ
   *       - in: query
   *         name: codigo
   *         schema:
   *           type: string
   *         description: Filtro por código
   *       - in: query
   *         name: cidade
   *         schema:
   *           type: string
   *         description: Filtro por cidade
   *       - in: query
   *         name: uf
   *         schema:
   *           type: string
   *         description: Filtro por UF
   *       - in: query
   *         name: categoria
   *         schema:
   *           type: string
   *         description: Filtro por categoria
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [ativo, inativo]
   *         description: Filtro por status
   *       - in: query
   *         name: orderBy
   *         schema:
   *           type: string
   *           default: created_at
   *         description: Campo para ordenação
   *       - in: query
   *         name: orderDirection
   *         schema:
   *           type: string
   *           default: desc
   *         description: Direção da ordenação (asc ou desc)
   *     responses:
   *       200:
   *         description: Lista de fornecedores
   */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Endpoint de listagem de fornecedores acessado');
      // Validação com defaults para campos obrigatórios
      const queryParams = {
        page: req.query.page ? Number(req.query.page) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
        razao_social: req.query.razao_social || '',
        nome_fantasia: req.query.nome_fantasia || '',
        cnpj: req.query.cnpj || '',
        codigo: req.query.codigo || '',
        cidade: req.query.cidade || '',
        uf: req.query.uf || '',
        categoria: req.query.categoria || '',
        status: req.query.status || '',
        orderBy: req.query.orderBy || 'created_at',
        orderDirection: req.query.orderDirection || 'desc'
      };

      const filters: Record<string, any> = {};
      
      // Aplicando filtros se fornecidos
      if (queryParams.razao_social) filters.razao_social = { like: queryParams.razao_social };
      if (queryParams.nome_fantasia) filters.nome_fantasia = { like: queryParams.nome_fantasia };
      if (queryParams.cnpj) filters.cnpj = { like: queryParams.cnpj };
      if (queryParams.codigo) filters.codigo = { like: queryParams.codigo };
      if (queryParams.cidade) filters.cidade = { like: queryParams.cidade };
      if (queryParams.uf) filters.uf = queryParams.uf;
      if (queryParams.categoria) filters.categoria = { like: queryParams.categoria };
      if (queryParams.status) filters.status = queryParams.status;

      logger.info('Consultando fornecedores com filtros:', filters);

      try {
        const { data, count } = await supabaseService.select('fornecedores', '*', {
          filters,
          order: { 
            column: queryParams.orderBy as string, 
            ascending: queryParams.orderDirection === 'asc' 
          },
          pagination: { 
            page: queryParams.page, 
            pageSize: queryParams.pageSize 
          }
        });

        logger.info(`Consulta realizada com sucesso. Encontrados ${count} fornecedores.`);

        res.status(200).json({
          success: true,
          count,
          data,
          pagination: {
            page: queryParams.page,
            pageSize: queryParams.pageSize,
            pageCount: Math.ceil((count || 0) / queryParams.pageSize),
            total: count
          }
        });
      } catch (error) {
        logger.error('Erro ao consultar fornecedores:', error);
        throw new AppError('Erro ao consultar fornecedores', 500);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/fornecedores/{id}:
   *   get:
   *     summary: Obtém um fornecedor pelo ID
   *     tags: [Fornecedores]
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
   *         description: Fornecedor encontrado
   *       404:
   *         description: Fornecedor não encontrado
   */
  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Endpoint de busca de fornecedor por ID acessado');
      const { id } = req.params;

      const { data } = await supabaseService.select('fornecedores', '*', {
        filters: { id }
      });

      if (!data || data.length === 0) {
        throw new AppError('Fornecedor não encontrado', 404);
      }

      res.status(200).json({
        success: true,
        data: data[0]
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/fornecedores/{id}:
   *   put:
   *     summary: Atualiza um fornecedor
   *     tags: [Fornecedores]
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
   *             $ref: '#/components/schemas/Fornecedor'
   *     responses:
   *       200:
   *         description: Fornecedor atualizado
   *       404:
   *         description: Fornecedor não encontrado
   *       409:
   *         description: CNPJ já existe para outro fornecedor
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Endpoint de atualização de fornecedor acessado');
      // Validação manual do corpo da requisição
      const { error } = updateFornecedorSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errorMessage = error.details
          .map((detail) => detail.message)
          .join(', ');
        
        throw new AppError(errorMessage, 400);
      }
      
      const { id } = req.params;
      const fornecedorData: Partial<Fornecedor> = req.body;

      // Verificar se o fornecedor existe
      const { data: existingFornecedor } = await supabaseService.select('fornecedores', '*', {
        filters: { id }
      });

      if (!existingFornecedor || existingFornecedor.length === 0) {
        throw new AppError('Fornecedor não encontrado', 404);
      }

      // Verificar se o CNPJ está sendo atualizado e se já existe para outro fornecedor
      if (fornecedorData.cnpj && fornecedorData.cnpj !== existingFornecedor[0].cnpj) {
        const { data: fornecedorWithSameCnpj } = await supabaseService.select('fornecedores', '*', {
          filters: { cnpj: fornecedorData.cnpj }
        });

        if (fornecedorWithSameCnpj && fornecedorWithSameCnpj.length > 0) {
          throw new AppError('CNPJ já existe para outro fornecedor', 409);
        }
      }

      // Verificar se o código está sendo atualizado e se já existe para outro fornecedor
      if (fornecedorData.codigo && fornecedorData.codigo !== existingFornecedor[0].codigo) {
        const { data: fornecedorWithSameCodigo } = await supabaseService.select('fornecedores', '*', {
          filters: { codigo: fornecedorData.codigo }
        });

        if (fornecedorWithSameCodigo && fornecedorWithSameCodigo.length > 0) {
          throw new AppError('Código já existe para outro fornecedor', 409);
        }
      }

      // Adicionar informações de atualização
      const updatedFornecedorData = {
        ...fornecedorData,
        updated_at: new Date(),
        updated_by: req.user?.id
      };

      // Atualizar o fornecedor
      const updatedFornecedor = await supabaseService.update('fornecedores', id, updatedFornecedorData);

      res.status(200).json({
        success: true,
        data: updatedFornecedor[0]
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/fornecedores/{id}:
   *   delete:
   *     summary: Remove um fornecedor
   *     tags: [Fornecedores]
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
   *         description: Fornecedor removido
   *       404:
   *         description: Fornecedor não encontrado
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Endpoint de exclusão de fornecedor acessado');
      const { id } = req.params;

      // Verificar se o fornecedor existe
      const { data: existingFornecedor } = await supabaseService.select('fornecedores', '*', {
        filters: { id }
      });

      if (!existingFornecedor || existingFornecedor.length === 0) {
        throw new AppError('Fornecedor não encontrado', 404);
      }

      // Deletar o fornecedor
      const deletedFornecedor = await supabaseService.delete('fornecedores', id);

      res.status(200).json({
        success: true,
        message: 'Fornecedor removido com sucesso',
        data: deletedFornecedor[0]
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new FornecedorController();