const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyJWT = require('../middlewares/verifyJWT.middleware');

router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.post('/login', userController.login);
// Solo proteger la ruta GET '/users/me'
router.get('/users/me', verifyJWT, userController.getMe);
router.post('/users/me/favorites', verifyJWT, userController.addToFavorites);
router.get('/users/:id', userController.getUser);



module.exports = router;
