const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');

describe('UserController', () => {

  const userData = {
    name: 'Manu Ferreira',
    email: 'manu@teste.com.br',
    password: '123Testando',
    isFavored: false,
    initialBalance: 20.000
  }

  describe('POST /api/users/register', () => {
    it('deve registrar usuário com dados válidos', async () => {

      const res = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201)

      expect(res.body.success).to.be.true;
      expect(res.body.message).to.equal('Usuário registrado com sucesso');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data.name).to.equal(userData.name);
      expect(res.body.data.email).to.equal(userData.email);

    });

    it('deve retornar erro 400 se dados obrigatórios estiverem faltando', async () => {
      const userData = { name: 'Marinho' };

      const res = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400)

      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal('Nome, email e senha são obrigatórios');

    });

    it('deve retornar erro 400 se email já existir', async () => {

      const userDataNew = {
        name: 'Denise Ferreira',
        email: 'denise@teste.com.br',
        password: '123Testando',
        isFavored: false,
        initialBalance: 10.000
      }

      const userDataNew2 = {
        name: 'Denise Alves',
        email: 'denise@teste.com.br',
        password: '123Testando!',
        isFavored: false,
        initialBalance: 17.000
      }
      // Registrar primeiro usuário
      await request(app)
        .post('/api/users/register')
        .send(userDataNew)
        .expect(201)

      // Tentar registrar usuário com mesmo email
      const res = await request(app)
        .post('/api/users/register')
        .send(userDataNew2)
        .expect(400)
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal('Usuário já cadastrado com este email');
    });
  });

  describe('POST /api/users/login', () => {

    it('deve fazer login com credenciais válidas', async () => {

      const userDataNew = {
        name: 'João Ferreira',
        email: 'joaof@teste.com.br',
        password: '123Testando',
        isFavored: false,
        initialBalance: 90.000
      }

      await request(app)
        .post('/api/users/register')
        .send(userDataNew)
        .expect(201)

      const loginData = { email: userDataNew.email, password: userDataNew.password }

      const res = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(200)
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.equal('Login realizado com sucesso');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data.email).to.equal(loginData.email);
      expect(res.body.data).to.not.have.property('password');
    });

    it('deve retornar erro 401 se usuário não existir', async () => {
      const loginData = { email: 'naoexiste@teste.com.br', password: 'Teste123' };

      const res = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(401)
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal('Usuário não encontrado');
    });

    it('deve retornar erro 401 se a senha estiver incorreta', async () => {
      const userDataNew = {
        name: 'Marinho Teste',
        email: 'marinho@teste.com.br',
        password: '123Testando',
        isFavored: false,
        initialBalance: 20.000
      } 

      await request(app)
        .post('/api/users/register')
        .send(userDataNew)
        .expect(201)

      const loginData = { email: userDataNew.email, password: 'errado123' }

      const res = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(401)
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal('Senha incorreta');
    });
  });
});
