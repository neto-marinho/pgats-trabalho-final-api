const { expect } = require('chai');
const sinon = require('sinon');
const userController = require('../../controller/userController');
const userService = require('../../service/userService');

describe('UserController com Sinons', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('register - Registrar Usuário', () => {
    
    it('deve registrar usuário com sucesso', async () => {
      const dadosUsuario = {
        name: 'Maria Silva',
        email: 'maria@teste.com',
        password: '123456',
        isFavored: false,
        initialBalance: 1000
      };

      const req = {
        body: dadosUsuario
      };

      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub()
      };

      const usuarioRetornado = {
        id: 1,
        name: 'Maria Silva',
        email: 'maria@teste.com',
        isFavored: false,
        balance: 1000
      };

      const serviceStub = sandbox.stub(userService, 'registerUser').resolves(usuarioRetornado);

      await userController.register(req, res);

      expect(serviceStub.calledOnce).to.be.true;
      expect(serviceStub.calledWith(dadosUsuario)).to.be.true;

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: usuarioRetornado
      })).to.be.true;
    });

    it('deve dar erro quando senha é muito curta', async () => {
      const dadosUsuario = {
        name: 'João Santos',
        email: 'joao@teste.com',
        password: '123'
      };

      const req = { body: dadosUsuario };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub()
      };

      const erro = new Error('Senha deve ter pelo menos 6 caracteres');
      const serviceStub = sandbox.stub(userService, 'registerUser').rejects(erro);

      await userController.register(req, res);

      expect(serviceStub.calledOnce).to.be.true;
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: 'Senha deve ter pelo menos 6 caracteres'
      })).to.be.true;
    });

    it('deve dar erro quando email já existe', async () => {
      const dadosUsuario = {
        name: 'Ana Costa',
        email: 'ana@teste.com',
        password: '123456'
      };

      const req = { body: dadosUsuario };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub()
      };

      const erro = new Error('Usuário já cadastrado com este email');
      const serviceStub = sandbox.stub(userService, 'registerUser').rejects(erro);

      await userController.register(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: 'Usuário já cadastrado com este email'
      })).to.be.true;
    });
  });

  describe('login - Fazer Login', () => {
    
    it('deve fazer login com sucesso', async () => {
      const dadosLogin = {
        email: 'pedro@teste.com',
        password: '123456'
      };

      const req = { body: dadosLogin };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub()
      };

      const usuarioLogado = {
        id: 2,
        name: 'Pedro Oliveira',
        email: 'pedro@teste.com',
        isFavored: true,
        balance: 5000
      };

      const serviceStub = sandbox.stub(userService, 'login').resolves(usuarioLogado);

      await userController.login(req, res);

      expect(serviceStub.calledOnce).to.be.true;
      expect(serviceStub.calledWith('pedro@teste.com', '123456')).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        message: 'Login realizado com sucesso',
        data: usuarioLogado
      })).to.be.true;
    });

    it('deve dar erro quando senha está errada', async () => {
      const dadosLogin = {
        email: 'carla@teste.com',
        password: 'senhaerrada'
      };

      const req = { body: dadosLogin };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub()
      };

      const erro = new Error('Senha incorreta');
      const serviceStub = sandbox.stub(userService, 'login').rejects(erro);

      await userController.login(req, res);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: 'Senha incorreta'
      })).to.be.true;
    });

    it('deve dar erro quando usuário não existe', async () => {
      const dadosLogin = {
        email: 'naoexiste@teste.com',
        password: '123456'
      };

      const req = { body: dadosLogin };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub()
      };

      const erro = new Error('Usuário não encontrado');
      const serviceStub = sandbox.stub(userService, 'login').rejects(erro);

      await userController.login(req, res);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: 'Usuário não encontrado'
      })).to.be.true;
    });
  });

  describe('getUserById - Buscar Usuário por ID', () => {
    
    it('deve buscar usuário existente', async () => {
      const req = { params: { id: '3' } };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub()
      };

      const usuarioEncontrado = {
        id: 3,
        name: 'Lucas Ferreira',
        email: 'lucas@teste.com',
        isFavored: false,
        balance: 2500
      };

      const serviceStub = sandbox.stub(userService, 'getUserById').resolves(usuarioEncontrado);

      await userController.getUserById(req, res);

      expect(serviceStub.calledOnce).to.be.true;
      expect(serviceStub.calledWith(3)).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        data: usuarioEncontrado
      })).to.be.true;
    });

    it('deve dar erro quando ID é inválido', async () => {
      const req = { params: { id: 'abc' } };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub()
      };

      const serviceStub = sandbox.stub(userService, 'getUserById');

      await userController.getUserById(req, res);

      expect(serviceStub.called).to.be.false;
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: 'ID do usuário deve ser um número válido'
      })).to.be.true;
    });

    it('deve dar erro quando usuário não existe', async () => {
      const req = { params: { id: '999' } };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub()
      };

      const erro = new Error('Usuário não encontrado');
      const serviceStub = sandbox.stub(userService, 'getUserById').rejects(erro);

      await userController.getUserById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: 'Usuário não encontrado'
      })).to.be.true;
    });
  });

  describe('getAllUsers - Listar Todos os Usuários', () => {
    
    it('deve listar usuários com sucesso', async () => {
      const req = {};
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub()
      };

      const listaUsuarios = [
        { id: 1, name: 'Maria Silva', email: 'maria@teste.com' },
        { id: 2, name: 'João Santos', email: 'joao@teste.com' },
        { id: 3, name: 'Ana Costa', email: 'ana@teste.com' }
      ];

      const serviceStub = sandbox.stub(userService, 'getAllUsers').resolves(listaUsuarios);

      await userController.getAllUsers(req, res);

      expect(serviceStub.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        data: listaUsuarios
      })).to.be.true;
    });

    it('deve dar erro quando service falha', async () => {
      const req = {};
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub()
      };

      const erro = new Error('Erro interno do servidor');
      const serviceStub = sandbox.stub(userService, 'getAllUsers').rejects(erro);

      await userController.getAllUsers(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: 'Erro interno do servidor'
      })).to.be.true;
    });
  });

  describe('updateUserToFavored - Tornar Usuário Favorecido', () => {
    
    it('deve tornar usuário favorecido com sucesso', async () => {
      const req = { params: { id: '4' } };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub()
      };

      const usuarioAtualizado = {
        id: 4,
        name: 'Carlos Lima',
        email: 'carlos@teste.com',
        isFavored: true,
        balance: 10000
      };

      const serviceStub = sandbox.stub(userService, 'updateUserToFavored').resolves(usuarioAtualizado);

      await userController.updateUserToFavored(req, res);

      expect(serviceStub.calledOnce).to.be.true;
      expect(serviceStub.calledWith(4)).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        message: 'Usuário atualizado para favorecido com sucesso',
        data: usuarioAtualizado
      })).to.be.true;
    });

    it('deve dar erro quando usuário não existe', async () => {
      const req = { params: { id: '888' } };
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.stub()
      };

      const erro = new Error('Usuário não encontrado');
      const serviceStub = sandbox.stub(userService, 'updateUserToFavored').rejects(erro);

      await userController.updateUserToFavored(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        message: 'Usuário não encontrado'
      })).to.be.true;
    });
  });

});