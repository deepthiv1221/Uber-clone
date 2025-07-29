const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blacklistToken.model');
const jwt = require('jsonwebtoken'); // ✅ Added: required for logoutUser

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;
    const hashedPassword = await userModel.hashPassword(password);
    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword
    });
    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
};

// ✅ Added missing function: loginUser
module.exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = user.generateAuthToken();
    res.status(200).json({ token, user });
};

// ✅ Added missing function: getUserProfile
module.exports.getUserProfile = async (req, res) => {
    try {
        const user = await userService.findUserById(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

// ✅ Added missing function: logoutUser
module.exports.logoutUser = async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(400).json({ message: 'Token missing' });
    }

    const decoded = jwt.decode(token);
    await blackListTokenModel.create({
        token,
        expiresAt: new Date(decoded.exp * 1000)
    });

    res.status(200).json({ message: 'Logged out successfully' });
};
