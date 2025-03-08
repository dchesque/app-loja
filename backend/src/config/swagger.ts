import swaggerJsdoc from 'swagger-jsdoc';
import env from './env';

// Configuração básica do Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LOJA API Documentation',
      version: '1.0.0',
      description: 'Documentação da API do aplicativo empresarial LOJA',
      contact: {
        name: 'Equipe de Desenvolvimento',
        email: 'dev@loja.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  // Caminhos para os arquivos com as anotações JSDoc do Swagger
  apis: [
    './src/modules/**/*Routes.ts',
    './src/modules/**/*Controller.ts'
  ]
};

// Exportando as especificações do Swagger
export const specs = swaggerJsdoc(options);