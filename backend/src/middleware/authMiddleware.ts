import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import { supabase } from '../config/database';

// Interface para o token decodificado
interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

// Extensão da interface Request para incluir o usuário
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

// Middleware para verificação de autenticação
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtendo o token do cabeçalho Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    // Verificando e decodificando o token
    const decoded = jwt.verify(token, env.JWT_SECRET) as DecodedToken;

    // Verificando se o usuário ainda existe no Supabase
    const { data, error } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', decoded.id)
      .single();

    if (error || !data) {
      return res.status(401).json({ message: 'Usuário não encontrado ou token inválido' });
    }

    // Anexando informações do usuário ao objeto de requisição
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Token inválido' });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expirado' });
    }
    
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Middleware para autorização baseada em roles
export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }

    next();
  };
};

// Exportando funções para uso em outras partes da aplicação
export default {
  authenticate,
  authorize
};