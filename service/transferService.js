const userRepository = require('../repository/userRepository');
const userService = require('./userService');

class TransferService {
  // Realizar transferência
  async makeTransfer(fromUserId, toUserId, amount, description = '') {
    // Validar dados obrigatórios
    if (!fromUserId || !toUserId || !amount) {
      throw new Error('ID do remetente, destinatário e valor são obrigatórios');
    }

    // Validar valor
    if (amount <= 0) {
      throw new Error('Valor deve ser maior que zero');
    }

    // Verificar se remetente e destinatário existem
    const fromUser = userRepository.findById(fromUserId);
    const toUser = userRepository.findById(toUserId);

    if (!fromUser) {
      throw new Error('Usuário remetente não encontrado');
    }

    if (!toUser) {
      throw new Error('Usuário destinatário não encontrado');
    }

    // Verificar se não está tentando transferir para si mesmo
    if (fromUserId === toUserId) {
      throw new Error('Não é possível transferir para si mesmo');
    }

    // Verificar se destinatário é favorecido
    const isToUserFavored = toUser.isFavored;

    // Aplicar regra: transferências para não favorecidos só podem ser até R$ 5.000,00
    if (!isToUserFavored && amount > 5000) {
      throw new Error('Transferências para usuários não favorecidos só podem ser até R$ 5.000,00');
    }

    // Verificar saldo do remetente
    await userService.checkBalance(fromUserId, amount);

    // Calcular novos saldos
    const newFromBalance = fromUser.balance - amount;
    const newToBalance = toUser.balance + amount;

    // Atualizar saldos
    await userService.updateUserBalance(fromUserId, newFromBalance);
    await userService.updateUserBalance(toUserId, newToBalance);

    // Criar registro da transferência
    const transfer = userRepository.createTransfer({
      fromUserId,
      toUserId,
      amount,
      description
    });

    return {
      id: transfer.id,
      fromUserId: transfer.fromUserId,
      toUserId: transfer.toUserId,
      amount: transfer.amount,
      description: transfer.description,
      createdAt: transfer.createdAt
    };
  }

  // Buscar transferências por usuário
  async getTransfersByUserId(userId) {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    const user = userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const transfers = userRepository.findTransfersByUserId(userId);
    
    // Enriquecer dados com informações dos usuários
    const enrichedTransfers = transfers.map(transfer => {
      const fromUser = userRepository.findById(transfer.fromUserId);
      const toUser = userRepository.findById(transfer.toUserId);
      
      return {
        id: transfer.id,
        fromUser: {
          id: fromUser.id,
          name: fromUser.name,
          email: fromUser.email
        },
        toUser: {
          id: toUser.id,
          name: toUser.name,
          email: toUser.email
        },
        amount: transfer.amount,
        description: transfer.description,
        createdAt: transfer.createdAt
      };
    });

    return enrichedTransfers;
  }

  // Buscar todas as transferências
  async getAllTransfers() {
    const transfers = userRepository.findAllTransfers();
    
    // Enriquecer dados com informações dos usuários
    const enrichedTransfers = transfers.map(transfer => {
      const fromUser = userRepository.findById(transfer.fromUserId);
      const toUser = userRepository.findById(transfer.toUserId);
      
      return {
        id: transfer.id,
        fromUser: {
          id: fromUser.id,
          name: fromUser.name,
          email: fromUser.email
        },
        toUser: {
          id: toUser.id,
          name: toUser.name,
          email: toUser.email
        },
        amount: transfer.amount,
        description: transfer.description,
        createdAt: transfer.createdAt
      };
    });

    return enrichedTransfers;
  }

  // Buscar transferência por ID
  async getTransferById(transferId) {
    const transfers = userRepository.findAllTransfers();
    const transfer = transfers.find(t => t.id === transferId);
    
    if (!transfer) {
      throw new Error('Transferência não encontrada');
    }

    const fromUser = userRepository.findById(transfer.fromUserId);
    const toUser = userRepository.findById(transfer.toUserId);
    
    return {
      id: transfer.id,
      fromUser: {
        id: fromUser.id,
        name: fromUser.name,
        email: fromUser.email
      },
      toUser: {
        id: toUser.id,
        name: toUser.name,
        email: toUser.email
      },
      amount: transfer.amount,
      description: transfer.description,
      createdAt: transfer.createdAt
    };
  }
}

module.exports = new TransferService();
