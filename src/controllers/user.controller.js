const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");

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
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).send();
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      res.status(400).json({ message: "Email already registered" });
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
    return res.status(404).json({ message: "User not found" });
  }

  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  return res.status(200).json({ message: "U ARE IN", user, token });
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addToFavorites = async (req, res) => {
  try {
    const userId = req.userId;
    const gameId = req.body.gameId;
    const name = req.body.name;
    const imageUrl = req.body.imageUrl;
    const genres = req.body.genres;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const gameExists = user.favoriteGames.some(
      (game) => game.gameId === gameId
    );
    if (!gameExists) {
      user.favoriteGames.push({ gameId, imageUrl, genres, name});
      await user.save();
    }

    res.status(200).json({ message: "Game added to favorites" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.removeFromFavorites = async (req, res) => {
  try {
    const userId = req.userId;
    const gameId = parseInt(req.params.gameId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const gameIndex = user.favoriteGames.findIndex(
      (game) => game.gameId === gameId
    );
    if (gameIndex !== -1) {
      user.favoriteGames.splice(gameIndex, 1);
      await user.save();
      res.status(200).json({ message: "Game removed from favorites" });
    } else {
      res.status(404).json({ message: "Game not found in favorites" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
