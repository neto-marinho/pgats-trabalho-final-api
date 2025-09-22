const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');
const { faker } = require("@faker-js/faker");

describe('TransferController', () => {
    let usuario1, usuario2, usuario3;

    beforeEach(async () => {
        const user1 = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: '123456',
            isFavored: false,
            initialBalance: 50000
        };

        const res1 = await request(app)
            .post('/api/users/register')
            .send(user1)
            .expect(201);

        usuario1 = res1.body.data;

        const user2 = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: '123456',
            isFavored: false,
            initialBalance: 500
        };

        const res2 = await request(app)
            .post('/api/users/register')
            .send(user2)
            .expect(201);

        usuario2 = res2.body.data;

        const user3 = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: '123456',
            isFavored: true,
            initialBalance: 2000
        };

        const res3 = await request(app)
            .post('/api/users/register')
            .send(user3)
            .expect(201);

        usuario3 = res3.body.data;
    });

    describe('POST /api/transfers - Realizar Transferência', () => {

        it('deve transferir R$ 100 com sucesso para um usuário não favorecido', async () => {
            const transferencia = {
                fromUserId: usuario1.id,
                toUserId: usuario2.id,
                amount: 100,
                description: 'Transferência de teste'
            };

            const res = await request(app)
                .post('/api/transfers')
                .send(transferencia)
                .expect(201);

            expect(res.body.success).to.be.true;
            expect(res.body.message).to.equal('Transferência realizada com sucesso');
            expect(res.body.data.amount).to.equal(100);
            expect(res.body.data.fromUserId).to.equal(usuario1.id);
            expect(res.body.data.toUserId).to.equal(usuario2.id);
        });

        it('deve transferir R$ 10.000 para usuário favorecido', async () => {
            const transferencia = {
                fromUserId: usuario1.id,
                toUserId: usuario3.id,
                amount: 10000,
                description: 'Transferência alta para favorecido'
            };

            const res = await request(app)
                .post('/api/transfers')
                .send(transferencia)
                .expect(201);

            expect(res.body.success).to.be.true;
            expect(res.body.data.amount).to.equal(10000);
        });

        it('deve dar erro ao tentar transferir R$ 6.000 para usuário não favorecido', async () => {
            const transferencia = {
                fromUserId: usuario1.id,
                toUserId: usuario2.id,
                amount: 6000,
                description: 'Transferência acima do limite'
            };

            const res = await request(app)
                .post('/api/transfers')
                .send(transferencia)
                .expect(400);

            expect(res.body.success).to.be.false;
            expect(res.body.message).to.include('R$ 5.000,00');
        });

        it('deve dar erro ao tentar transferir valor negativo', async () => {
            const transferencia = {
                fromUserId: usuario1.id,
                toUserId: usuario2.id,
                amount: -50,
                description: 'Valor negativo'
            };

            const res = await request(app)
                .post('/api/transfers')
                .send(transferencia)
                .expect(400);

            expect(res.body.success).to.be.false;
            expect(res.body.message).to.include('maior que zero');
        });
    });

    describe('GET /api/transfers - Consultar Transferências', () => {

        it('deve listar todas as transferências', async () => {
            await request(app)
                .post('/api/transfers')
                .send({
                    fromUserId: usuario1.id,
                    toUserId: usuario2.id,
                    amount: 50,
                    description: 'Transferência para teste'
                })
                .expect(201);

            const res = await request(app)
                .get('/api/transfers')
                .expect(200);

            expect(res.body.success).to.be.true;
            expect(res.body.data).to.be.an('array');
            expect(res.body.data.length).to.be.greaterThan(0);
        });
    });

    describe('Validações de limite', () => {

        it('deve permitir transferência de R$ 4.999 para usuário não favorecido', async () => {
            const transferencia = {
                fromUserId: usuario1.id,
                toUserId: usuario2.id,
                amount: 4999,
                description: 'Transferência no limite'
            };

            const res = await request(app)
                .post('/api/transfers')
                .send(transferencia)
                .expect(201);

            expect(res.body.success).to.be.true;
            expect(res.body.data.amount).to.equal(4999);
        });

        it('deve dar erro ao tentar transferir R$ 5.001 para usuário não favorecido', async () => {
            const transferencia = {
                fromUserId: usuario1.id,
                toUserId: usuario2.id,
                amount: 5001,
                description: 'Transferência acima do limite'
            };

            const res = await request(app)
                .post('/api/transfers')
                .send(transferencia)
                .expect(400);

            expect(res.body.success).to.be.false;
            expect(res.body.message).to.include('R$ 5.000,00');
        });
    });
});