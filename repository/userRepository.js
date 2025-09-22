// Banco de dados em memória
let users = [];
let transfers = [];
let nextUserId = 1;
let nextTransferId = 1;

class UserRepository {
  // Buscar usuário por email
  findByEmail(email) {
    return users.find(user => user.email === email);
  }

  // Buscar usuário por ID
  findById(id) {
    return users.find(user => user.id === id);
  }

  // Buscar todos os usuários
  findAll() {
    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      isFavored: user.isFavored,
      balance: user.balance
    }));
  }

  // Criar novo usuário
  create(userData) {
    const newUser = {
      id: nextUserId++,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      isFavored: userData.isFavored || false,
      balance: userData.balance || 0,
      createdAt: new Date()
    };
    
    users.push(newUser);
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isFavored: newUser.isFavored,
      balance: newUser.balance
    };
  }

  // Atualizar saldo do usuário
  updateBalance(userId, newBalance) {
    const user = users.find(u => u.id === userId);
    if (user) {
      user.balance = newBalance;
      return true;
    }
    return false;
  }

  // Criar transferência
  createTransfer(transferData) {
    const newTransfer = {
      id: nextTransferId++,
      fromUserId: transferData.fromUserId,
      toUserId: transferData.toUserId,
      amount: transferData.amount,
      description: transferData.description || '',
      createdAt: new Date()
    };
    
    transfers.push(newTransfer);
    return newTransfer;
  }

  // Buscar transferências por usuário
  findTransfersByUserId(userId) {
    return transfers.filter(transfer => 
      transfer.fromUserId === userId || transfer.toUserId === userId
    );
  }

  // Buscar todas as transferências
  findAllTransfers() {
    return transfers;
  }

  // Limpar dados (para testes)
  clear() {
    users = [];
    transfers = [];
    nextUserId = 1;
    nextTransferId = 1;
  }
}

module.exports = new UserRepository();
