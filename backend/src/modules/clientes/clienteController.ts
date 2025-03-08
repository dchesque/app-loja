import { Request, Response, NextFunction } from 'express';
import supabaseService from '../../services/supabaseService';
import { AppError } from '../../middleware/errorHandler';
import { Cliente, createClienteSchema, updateClienteSchema, clienteQuerySchema } from './ClienteModel';
import { logger } from '../../middleware/errorHandler';

class ClienteController {
  /**
   * @swagger
   * /api/clientes:
   *   post:
   *     summary: Cria um novo cliente
   *     tags: [Clientes]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Cliente'
   *     responses:
   *       201:
   *         description: Cliente criado com sucesso
   *       400:
   *         description: Dados inválidos
   *       409:
   *         description: Cliente já existe com este CPF ou código
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // Validação manual do corpo da requisição
      const { error } = createClienteSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errorMessage = error.details
          .map((detail) => detail.message)
          .join(', ');
        
        throw new AppError(errorMessage, 400);
      }

      const clienteData: Cliente = req.body;
      
      // Verificar se já existe um cliente com o mesmo CPF
      const { data: existingClienteByCpf } = await supabaseService.select('clientes', '*', {
        filters: { cpf: clienteData.cpf }
      });

      if (existingClienteByCpf && existingClienteByCpf.length > 0) {
        throw new AppError('Cliente já existe com este CPF', 409);
      }

      // Verificar se já existe um cliente com o mesmo código
      const { data: existingClienteByCodigo } = await supabaseService.select('clientes', '*', {
        filters: { codigo: clienteData.codigo }
      });

      if (existingClienteByCodigo && existingClienteByCodigo.length > 0) {
        throw new AppError('Cliente já existe com este código', 409);
      }

      // Adicionar informações de criação
      const newCliente = {
        ...clienteData,
        created_at: new Date(),
        created_by: req.user?.id
      };

      // Inserir o cliente no banco de dados
      const cliente = await supabaseService.insert('clientes', newCliente);

      res.status(201).json({
        success: true,
        data: cliente[0]
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/clientes:
   *   get:
   *     summary: Lista todos os clientes
   *     tags: [Clientes]
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
   *         name: nome
   *         schema:
   *           type: string
   *         description: Filtro por nome do cliente
   *       - in: query
   *         name: cpf
   *         schema:
   *           type: string
   *         description: Filtro por CPF
   *       - in: query
   *         name: codigo
   *         schema:
   *           type: string
   *         description: Filtro por código
   *       - in: query
   *         name: loja
   *         schema:
   *           type: string
   *         description: Filtro por loja
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
   *         description: Lista de clientes
   */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      // Validação manual da query
      logger.info('Query params recebidos:', req.query);

      // Validação com defaults para campos obrigatórios
      const queryParams = {
        page: req.query.page ? Number(req.query.page) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
        nome: req.query.nome || '',
        cpf: req.query.cpf || '',
        codigo: req.query.codigo || '',
        loja: req.query.loja || '',
        cidade: req.query.cidade || '',
        uf: req.query.uf || '',
        orderBy: req.query.orderBy || 'created_at',
        orderDirection: req.query.orderDirection || 'desc'
      };

      const filters: Record<string, any> = {};
      
      // Aplicando filtros se fornecidos
      if (queryParams.nome) filters.nome = { like: queryParams.nome };
      if (queryParams.cpf) filters.cpf = { like: queryParams.cpf };
      if (queryParams.codigo) filters.codigo = { like: queryParams.codigo };
      if (queryParams.loja) filters.loja = { like: queryParams.loja };
      if (queryParams.cidade) filters.cidade = { like: queryParams.cidade };
      if (queryParams.uf) filters.uf = queryParams.uf;

      logger.info('Consultando clientes com filtros:', filters);

      try {
        const { data, count } = await supabaseService.select('clientes', '*', {
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

        logger.info(`Consulta realizada com sucesso. Encontrados ${count} clientes.`);

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
        logger.error('Erro ao consultar clientes:', error);
        throw new AppError('Erro ao consultar clientes', 500);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/clientes/{id}:
   *   get:
   *     summary: Obtém um cliente pelo ID
   *     tags: [Clientes]
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
   *         description: Cliente encontrado
   *       404:
   *         description: Cliente não encontrado
   */
  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const { data } = await supabaseService.select('clientes', '*', {
        filters: { id }
      });

      if (!data || data.length === 0) {
        throw new AppError('Cliente não encontrado', 404);
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
   * /api/clientes/{id}:
   *   put:
   *     summary: Atualiza um cliente
   *     tags: [Clientes]
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
   *             $ref: '#/components/schemas/Cliente'
   *     responses:
   *       200:
   *         description: Cliente atualizado
   *       404:
   *         description: Cliente não encontrado
   *       409:
   *         description: CPF já existe para outro cliente
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      // Validação manual do corpo da requisição
      const { error } = updateClienteSchema.validate(req.body, {
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
      const clienteData: Partial<Cliente> = req.body;

      // Verificar se o cliente existe
      const { data: existingCliente } = await supabaseService.select('clientes', '*', {
        filters: { id }
      });

      if (!existingCliente || existingCliente.length === 0) {
        throw new AppError('Cliente não encontrado', 404);
      }

      // Verificar se o CPF está sendo atualizado e se já existe para outro cliente
      if (clienteData.cpf && clienteData.cpf !== existingCliente[0].cpf) {
        const { data: clienteWithSameCpf } = await supabaseService.select('clientes', '*', {
          filters: { cpf: clienteData.cpf }
        });

        if (clienteWithSameCpf && clienteWithSameCpf.length > 0) {
          throw new AppError('CPF já existe para outro cliente', 409);
        }
      }

      // Verificar se o código está sendo atualizado e se já existe para outro cliente
      if (clienteData.codigo && clienteData.codigo !== existingCliente[0].codigo) {
        const { data: clienteWithSameCodigo } = await supabaseService.select('clientes', '*', {
          filters: { codigo: clienteData.codigo }
        });

        if (clienteWithSameCodigo && clienteWithSameCodigo.length > 0) {
          throw new AppError('Código já existe para outro cliente', 409);
        }
      }

      // Adicionar informações de atualização
      const updatedClienteData = {
        ...clienteData,
        updated_at: new Date(),
        updated_by: req.user?.id
      };

      // Atualizar o cliente
      const updatedCliente = await supabaseService.update('clientes', id, updatedClienteData);

      res.status(200).json({
        success: true,
        data: updatedCliente[0]
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/clientes/{id}:
   *   delete:
   *     summary: Remove um cliente
   *     tags: [Clientes]
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
   *         description: Cliente removido
   *       404:
   *         description: Cliente não encontrado
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Verificar se o cliente existe
      const { data: existingCliente } = await supabaseService.select('clientes', '*', {
        filters: { id }
      });

      if (!existingCliente || existingCliente.length === 0) {
        throw new AppError('Cliente não encontrado', 404);
      }

      // Deletar o cliente
      const deletedCliente = await supabaseService.delete('clientes', id);

      res.status(200).json({
        success: true,
        message: 'Cliente removido com sucesso',
        data: deletedCliente[0]
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ClienteController();