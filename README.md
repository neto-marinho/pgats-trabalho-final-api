# Trabalho API

API Rest desenvolvida em JavaScript com Express para aprendizado de testes e automação a nível de API.

## 📋 Funcionalidades

- **Autenticação**: Login e registro de usuários
- **Gestão de Usuários**: Consulta e gerenciamento de usuários
- **Transferências**: Sistema de transferência de valores com regras de negócio
- **Documentação**: Swagger UI para documentação interativa da API

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas:

```
├── controller/          # Controladores (lógica de apresentação)
├── service/            # Serviços (lógica de negócio)
├── repository/         # Repositórios (acesso a dados)
├── routes/             # Definição das rotas
├── config/             # Configurações (Swagger, etc.)
├── app.js              # Configuração da aplicação Express
└── server.js           # Servidor HTTP
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

### Passos para instalação

1. **Clone o repositório** (se aplicável) ou navegue até o diretório do projeto

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor**:
   ```bash
   # Modo desenvolvimento (com nodemon)
   npm run dev
   
   # Modo produção
   npm start
   ```

4. **Acesse a API**:
   - API: http://localhost:3000
   - Documentação Swagger: http://localhost:3000/api-docs
   - Health Check: http://localhost:3000/health

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger UI em:
**http://localhost:3000/api-docs**

### Endpoints Principais

#### Usuários
- `POST /api/users/register` - Registrar novo usuário
- `POST /api/users/login` - Fazer login
- `GET /api/users` - Listar todos os usuários
- `GET /api/users/:id` - Buscar usuário por ID
- `PUT /api/users/:id/favored` - Tornar usuário favorecido

#### Transferências
- `POST /api/transfers` - Realizar transferência
- `GET /api/transfers` - Listar todas as transferências
- `GET /api/transfers/:id` - Buscar transferência por ID
- `GET /api/transfers/user/:id` - Buscar transferências por usuário

## 🔒 Regras de Negócio

### Autenticação
- Login e senha são obrigatórios para autenticação
- Senha deve ter pelo menos 6 caracteres
- Email deve ter formato válido

### Usuários
- Não é possível registrar usuários duplicados (mesmo email)
- Usuários podem ser marcados como "favorecidos"
- Saldo inicial não pode ser negativo

### Transferências
- Transferências para usuários **não favorecidos** só podem ser realizadas se o valor for **menor que R$ 5.000,00**
- Transferências para usuários **favorecidos** não têm limite de valor
- Não é possível transferir para si mesmo
- Usuário deve ter saldo suficiente para realizar a transferência

## 🧪 Testes

A API possui uma suíte completa de testes automatizados implementada com **Mocha**, **Chai** e **Supertest**.

### Estrutura dos Testes

```
test/
├── controllers/          # Testes dos controladores
│   ├── userController.test.js
│   └── transferController.test.js
├── services/            # Testes dos serviços
│   ├── userService.test.js
│   └── transferService.test.js
├── integration/         # Testes de integração
│   └── api.test.js
├── helpers/             # Funções auxiliares para testes
│   └── testHelpers.js
└── setup.js            # Configuração global dos testes
```

### Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (re-executa quando arquivos mudam)
npm run test:watch

# Executar testes com cobertura de código
npm run test:coverage
```

### Tipos de Testes Implementados


#### **Testes de Controllers**
- Validação de entrada de dados
- Respostas HTTP corretas
- Tratamento de erros de validação



## 📊 Banco de Dados

O banco de dados é em memória, utilizando variáveis JavaScript. Os dados são perdidos quando o servidor é reiniciado.


### Variáveis de Ambiente

- `PORT`: Porta do servidor (padrão: 3000)
- `CORS_ORIGIN`: Origem permitida para CORS (padrão: '*')


## 📝 Exemplos de Uso

### 1. Registrar um usuário

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "123456",
    "isFavored": false,
    "initialBalance": 1000
  }'
```

### 2. Fazer login

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "123456"
  }'
```

### 3. Realizar transferência

```bash
curl -X POST http://localhost:3000/api/transfers \
  -H "Content-Type: application/json" \
  -d '{
    "fromUserId": 1,
    "toUserId": 2,
    "amount": 100.50,
    "description": "Transferência de teste"
  }'
```

## 🛠️ Desenvolvimento

### Estrutura de Commits

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `test`: Testes
- `refactor`: Refatoração

### Scripts Disponíveis

- `npm start`: Inicia o servidor em modo produção
- `npm run dev`: Inicia o servidor em modo desenvolvimento com nodemon
- `npm test`: Executa os testes (quando implementados)

## 📄 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório do projeto.
