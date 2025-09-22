// Configuração global para os testes
const chai = require('chai');
const chaiHttp = require('chai-http');

// Configurar Chai
chai.use(chaiHttp);

// Configurações globais
global.expect = chai.expect;
global.should = chai.should();

// Timeout para testes
process.env.NODE_ENV = 'test';
