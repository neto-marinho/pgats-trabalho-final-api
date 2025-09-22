const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trabalho API',
      version: '1.0.0',
      description: 'API Rest para aprendizado de testes e automação',
      contact: {
        name: 'Desenvolvedor',
        email: 'dev@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do usuário'
            },
            name: {
              type: 'string',
              description: 'Nome do usuário'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário'
            },
            isFavored: {
              type: 'boolean',
              description: 'Indica se o usuário é favorecido para transferências'
            },
            balance: {
              type: 'number',
              format: 'float',
              description: 'Saldo atual do usuário'
            }
          }
        },
        Transfer: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da transferência'
            },
            fromUserId: {
              type: 'integer',
              description: 'ID do usuário remetente'
            },
            toUserId: {
              type: 'integer',
              description: 'ID do usuário destinatário'
            },
            amount: {
              type: 'number',
              format: 'float',
              description: 'Valor da transferência'
            },
            description: {
              type: 'string',
              description: 'Descrição da transferência'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora da criação'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Mensagem de erro'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Mensagem de sucesso'
            },
            data: {
              type: 'object',
              description: 'Dados retornados'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJSDoc(options);
