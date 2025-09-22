const transferService = require('../service/transferService');

class TransferController {
  // Realizar transferência
  async makeTransfer(req, res) {
    try {
      const { fromUserId, toUserId, amount, description } = req.body;
      
      const transfer = await transferService.makeTransfer(
        fromUserId,
        toUserId,
        amount,
        description
      );

      res.status(201).json({
        success: true,
        message: 'Transferência realizada com sucesso',
        data: transfer
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Buscar transferências por usuário
  async getTransfersByUserId(req, res) {
    try {
      const { id } = req.params;
      const userId = parseInt(id);
      
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'ID do usuário deve ser um número válido'
        });
      }

      const transfers = await transferService.getTransfersByUserId(userId);

      res.status(200).json({
        success: true,
        data: transfers
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Buscar todas as transferências
  async getAllTransfers(req, res) {
    try {
      const transfers = await transferService.getAllTransfers();

      res.status(200).json({
        success: true,
        data: transfers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Buscar transferência por ID
  async getTransferById(req, res) {
    try {
      const { id } = req.params;
      const transferId = parseInt(id);
      
      if (isNaN(transferId)) {
        return res.status(400).json({
          success: false,
          message: 'ID da transferência deve ser um número válido'
        });
      }

      const transfer = await transferService.getTransferById(transferId);

      res.status(200).json({
        success: true,
        data: transfer
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new TransferController();
