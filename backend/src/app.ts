import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import env from './config/env';

// Criando a aplicação Express
const app: Application = express();

// Middleware para segurança
app.use(helmet());

// Middleware para CORS
app.use(cors({
  origin: env.NODE_ENV === 'production' 
    ? ['https://seu-app-frontend.vercel.app'] 
    : 'http://localhost:3000',
  credentials: true
}));

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));

// Middleware para parsing URL encoded
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configurando rota de documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Configurando healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Configurando rotas da API
app.use('/api', routes);

// Middleware para tratar erros (deve ser o último middleware)
app.use(errorHandler);

export default app;