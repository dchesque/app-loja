import { supabase } from '../config/database';
import { logger } from '../middleware/errorHandler';

// Classe de serviço para encapsular as operações do Supabase
class SupabaseService {
  // Método para inserir dados em uma tabela
  async insert(table: string, data: any) {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select();

      if (error) {
        logger.error(`Erro ao inserir dados na tabela ${table}: ${error.message}`);
        throw error;
      }

      return result;
    } catch (error) {
      logger.error(`Exceção ao inserir dados na tabela ${table}: ${error}`);
      throw error;
    }
  }

  // Método para selecionar dados de uma tabela
  async select(table: string, columns: string, options?: {
    filters?: Record<string, any>;
    order?: { column: string; ascending?: boolean };
    pagination?: { page: number; pageSize: number };
  }) {
    try {
      let query = supabase
        .from(table)
        .select(columns, { count: 'exact' });

      // Aplicando filtros se fornecidos
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              query = query.in(key, value);
            } else if (typeof value === 'object' && value !== null) {
              if ('gt' in value) query = query.gt(key, value.gt);
              if ('gte' in value) query = query.gte(key, value.gte);
              if ('lt' in value) query = query.lt(key, value.lt);
              if ('lte' in value) query = query.lte(key, value.lte);
              if ('like' in value) query = query.like(key, `%${value.like}%`);
            } else {
              query = query.eq(key, value);
            }
          }
        });
      }

      // Aplicando ordenação se fornecida
      if (options?.order) {
        query = query.order(options.order.column, {
          ascending: options.order.ascending ?? true
        });
      }

      // Aplicando paginação se fornecida
      if (options?.pagination) {
        const { page, pageSize } = options.pagination;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        logger.error(`Erro ao selecionar dados da tabela ${table}: ${error.message}`);
        throw error;
      }

      return { data, count };
    } catch (error) {
      logger.error(`Exceção ao selecionar dados da tabela ${table}: ${error}`);
      throw error;
    }
  }

  // Método para atualizar dados em uma tabela
  async update(table: string, id: string | number, data: any) {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select();

      if (error) {
        logger.error(`Erro ao atualizar dados na tabela ${table}: ${error.message}`);
        throw error;
      }

      return result;
    } catch (error) {
      logger.error(`Exceção ao atualizar dados na tabela ${table}: ${error}`);
      throw error;
    }
  }

  // Método para deletar dados de uma tabela
  async delete(table: string, id: string | number) {
    try {
      const { data, error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        logger.error(`Erro ao deletar dados da tabela ${table}: ${error.message}`);
        throw error;
      }

      return data;
    } catch (error) {
      logger.error(`Exceção ao deletar dados da tabela ${table}: ${error}`);
      throw error;
    }
  }

  // Método para transações (operações em lote)
  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    // O Supabase não suporta transações diretamente via client
    // Esta é uma implementação simplificada, sem garantias ACID completas
    try {
      return await callback();
    } catch (error) {
      logger.error(`Erro na transação: ${error}`);
      throw error;
    }
  }
}

// Exportando uma instância do serviço
export default new SupabaseService();