const User = require('../models/users.model');
const bcrypt = require('bcrypt');


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
        const newUser = new User(req.body);        
        await newUser.save();
        res.status(201).send();
    } catch (err) {
        next(err);
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
        return res.status(401).json({ message: 'invalid password' });
    }
    
    return res.status(200).json({ message: 'U ARE IN', user });
    
};