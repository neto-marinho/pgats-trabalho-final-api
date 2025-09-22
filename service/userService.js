const userRepository = require('../repository/userRepository');

class UserService {
  // Registrar novo usuário
  async registerUser(userData) {
    const { name, email, password, isFavored = false, initialBalance = 0 } = userData;

    // Validar dados obrigatórios
    if (!name || !email || !password) {
      throw new Error('Nome, email e senha são obrigatórios');
    }

    // Verificar se usuário já existe
    const existingUser = userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Usuário já cadastrado com este email');
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }

    // Validar senha (mínimo 6 caracteres)
    if (password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    // Validar saldo inicial
    if (initialBalance < 0) {
      throw new Error('Saldo inicial não pode ser negativo');
    }

    // Criar usuário
    const newUser = userRepository.create({
      name,
      email,
      password,
      isFavored,
      balance: initialBalance
    });

    return newUser;
  }

  // Fazer login
  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    const user = userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user.password !== password) {
      throw new Error('Senha incorreta');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isFavored: user.isFavored,
      balance: user.balance
    };
  }

  // Buscar usuário por ID
  async getUserById(userId) {
    const user = userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isFavored: user.isFavored,
      balance: user.balance
    };
  }

  // Listar todos os usuários
  async getAllUsers() {
    return userRepository.findAll();
  }

  // Atualizar usuário para favorecido
  async updateUserToFavored(userId) {
    const user = userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    user.isFavored = true;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isFavored: user.isFavored,
      balance: user.balance
    };
  }

  // Verificar se usuário tem saldo suficiente
  async checkBalance(userId, amount) {
    const user = userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user.balance < amount) {
      throw new Error('Saldo insuficiente');
    }

    return true;
  }

  // Atualizar saldo do usuário
  async updateUserBalance(userId, newBalance) {
    const success = userRepository.updateBalance(userId, newBalance);
    if (!success) {
      throw new Error('Erro ao atualizar saldo do usuário');
    }
    return true;
  }
}

module.exports = new UserService();
