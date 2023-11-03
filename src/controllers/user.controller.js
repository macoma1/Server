const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');


exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        next(err);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
        const newUser = new User({
          ...req.body,
          password: hashedPassword
        });        
        await newUser.save();
        res.status(201).send();
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            res.status(400).json({ message: 'Email already registered' });
        } else {
            next(err);
        }
    }
    
};


exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        
        res.json(user);
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    // Genera el JWT
    const token = jwt.sign(
        { userId: user._id, email: user.email },
        SECRET_KEY,
        { expiresIn: '1h' } // Opcional: establece una duración para el token
    );

    return res.status(200).json({ message: 'U ARE IN', user, token });
}

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password'); // Excluye la contraseña al enviar datos del usuario
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addToFavorites = async (req, res) => {
    try {
        const userId = req.userId;
        const gameId = req.body.gameId;
        const imageUrl = req.body.imageUrl;  // Recibe el enlace de la imagen desde el cuerpo de la solicitud
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verifica si el juego ya está en la lista de favoritos
        const gameExists = user.favoriteGames.some(game => game.gameId === gameId);
        if (!gameExists) {
            user.favoriteGames.push({ gameId, imageUrl });
            await user.save();
        }

        res.status(200).json({ message: 'Game added to favorites' });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

