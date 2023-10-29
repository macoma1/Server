const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUser);
module.exports = router;
