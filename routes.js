const express = require('express');
const router = express.Router();
const homeController = require("./src/controllers/homeController");
const loginController = require("./src/controllers/loginController");

router.get('/', homeController.paginaInicial);
router.get('/login', loginController.index);
router.post('/login/login', loginController.login);
router.get('/login/cadastro', loginController.cadastro);
router.post('/login/cadastro/cadastrar', loginController.cadastrar);
router.get('/logoff', loginController.logoff);

module.exports = router; 