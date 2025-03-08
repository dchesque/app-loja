import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import env from '../config/env';

// Configuração do logger
const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: 'error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'combined.log' 
    })
  ]
});

// Classe para erros personalizados da aplicação
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware para tratamento centralizado de erros
export const errorHandler = (
  err: Error | AppError, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // Log do erro
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
    params: req.params
  });

  // Verificando se é um erro personalizado
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      // No ambiente de produção, não envie a stack trace
      ...(env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Para erros não tratados
  const statusCode = 500;
  const message = 'Erro interno do servidor';
  
  return res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && { 
      originalMessage: err.message,
      stack: err.stack 
    })
  });
};

// Exportando logger para uso em outras partes da aplicação
export { logger };

export default errorHandler;