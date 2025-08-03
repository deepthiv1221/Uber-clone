const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blacklistToken.model');
const jwt = require('jsonwebtoken'); // ✅ Added: required for logoutUser

module.exports.registerUser = async (req, res, next) => {
    try {
        console.log('🔍 Registration attempt started');
        console.log('📝 Request body:', req.body);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('❌ Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password } = req.body;
        console.log('✅ Validation passed. Email:', email);
        
        // Check if user already exists
        console.log('🔍 Checking if user exists...');
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            console.log('❌ User already exists');
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        console.log('✅ User does not exist, proceeding...');
        

        
        console.log('👤 Creating user...');
        const user = await userService.createUser({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            },
            email,
            password: password
        });
        console.log('✅ User created successfully:', user._id);
        
        console.log('🔑 Generating token...');
        const token = user.generateAuthToken();
        console.log('✅ Token generated successfully');

        console.log('🎉 Registration completed successfully!');
        res.status(201).json({ token, user });
    } catch (error) {
        console.error('💥 Registration error details:');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Full error:', error);
        res.status(500).json({ message: 'Internal server error during registration', error: error.message });
    }
};

// ✅ Added missing function: loginUser
module.exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

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
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error during login', error: error.message });
    }
};

// ✅ Added missing function: getUserProfile
module.exports.getUserProfile = async (req, res) => {
    try {
        console.log("Decoded ID:", req.user.id);
        const user = await userService.findUserById(req.user._id);
        console.log("Found user:", user);
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching profile", error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
};



// ✅ Added missing function: logoutUser
module.exports.logoutUser = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token;
        if (!token) {
            return res.status(400).json({ message: 'Token missing' });
        }

        const decoded = jwt.decode(token);
        if (!decoded) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        await blackListTokenModel.create({
            token,
            expiresAt: new Date(decoded.exp * 1000)
        });

        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Internal server error during logout', error: error.message });
    }
};
