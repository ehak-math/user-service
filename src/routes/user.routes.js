const express = require('express');
const ctrl = require('../controllers/user.controller');

const router = express.Router();

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/:id', ctrl.getUser);
router.post('/verify', ctrl.verifyToken);

module.exports = router;
