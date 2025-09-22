const express = require('express');
const router = express.Router();
const transferController = require('../controller/transferController');

/**
 * @swagger
 * /api/transfers:
 *   post:
 *     summary: Realizar transferência
 *     tags: [Transferências]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromUserId
 *               - toUserId
 *               - amount
 *             properties:
 *               fromUserId:
 *                 type: integer
 *                 description: ID do usuário remetente
 *               toUserId:
 *                 type: integer
 *                 description: ID do usuário destinatário
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Valor da transferência
 *               description:
 *                 type: string
 *                 description: Descrição da transferência
 *     responses:
 *       201:
 *         description: Transferência realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Transfer'
 *       400:
 *         description: Dados inválidos ou regras de negócio violadas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', transferController.makeTransfer);

/**
 * @swagger
 * /api/transfers:
 *   get:
 *     summary: Listar todas as transferências
 *     tags: [Transferências]
 *     responses:
 *       200:
 *         description: Lista de transferências retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           fromUser:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                           toUser:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                           amount:
 *                             type: number
 *                           description:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', transferController.getAllTransfers);

/**
 * @swagger
 * /api/transfers/{id}:
 *   get:
 *     summary: Buscar transferência por ID
 *     tags: [Transferências]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da transferência
 *     responses:
 *       200:
 *         description: Transferência encontrada
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         fromUser:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             email:
 *                               type: string
 *                         toUser:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             email:
 *                               type: string
 *                         amount:
 *                           type: number
 *                         description:
 *                           type: string
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *       404:
 *         description: Transferência não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', transferController.getTransferById);

/**
 * @swagger
 * /api/transfers/user/{id}:
 *   get:
 *     summary: Buscar transferências por usuário
 *     tags: [Transferências]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Transferências do usuário retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           fromUser:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                           toUser:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                           amount:
 *                             type: number
 *                           description:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/user/:id', transferController.getTransfersByUserId);

module.exports = router;
