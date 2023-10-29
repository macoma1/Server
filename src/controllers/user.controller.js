const User = require('../models/users.model');

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