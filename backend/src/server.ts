import app from './app';
import env from './config/env';
import { logger } from './middleware/errorHandler';

// Definindo porta do servidor
const PORT = env.PORT;

// Inicializando o servidor
const server = app.listen(PORT, () => {
  logger.info(`Servidor rodando no ambiente ${env.NODE_ENV} na porta ${PORT}`);
  logger.info(`Documentação disponível em http://localhost:${PORT}/api-docs`);
});

// Tratamento de exceções não capturadas
process.on('uncaughtException', (error) => {
  logger.error('ERRO NÃO CAPTURADO:', error);
  process.exit(1);
});

// Tratamento de rejeições de promessas não capturadas
process.on('unhandledRejection', (reason, promise) => {
  logger.error('REJEIÇÃO NÃO TRATADA:', { reason, promise });
  process.exit(1);
});

// Tratamento de sinais de término
process.on('SIGTERM', () => {
  logger.info('Sinal SIGTERM recebido. Fechando o servidor...');
  server.close(() => {
    logger.info('Servidor fechado.');
    process.exit(0);
  });
});

export default server;