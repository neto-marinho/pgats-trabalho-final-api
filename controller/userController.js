const userService = require('../service/userService');

class UserController {
  // Registrar usuário
  async register(req, res) {
    try {
      const { name, email, password, isFavored, initialBalance } = req.body;
      
      const newUser = await userService.registerUser({
        name,
        email,
        password,
        isFavored,
        initialBalance
      });

      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: newUser
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Fazer login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const user = await userService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: user
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // Buscar usuário por ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const userId = parseInt(id);
      
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'ID do usuário deve ser um número válido'
        });
      }

      const user = await userService.getUserById(userId);

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Listar todos os usuários
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();

      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Atualizar usuário para favorecido
  async updateUserToFavored(req, res) {
    try {
      const { id } = req.params;
      const userId = parseInt(id);
      
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'ID do usuário deve ser um número válido'
        });
      }

      const user = await userService.updateUserToFavored(userId);

      res.status(200).json({
        success: true,
        message: 'Usuário atualizado para favorecido com sucesso',
        data: user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new UserController();
