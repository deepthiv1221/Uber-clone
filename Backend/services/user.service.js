const userModel = require('../models/user.model');


module.exports.createUser = async (userData) => {
    try {
        console.log('Service: Creating user with data:', userData);
        const user = await userModel.create(userData);
        console.log('Service: User created successfully:', user);
        return user;
    } catch (error) {
        console.error('Service: Error creating user:', error);
        throw error;
    }
};

module.exports.findUserById = async (id) => {
    return await userModel.findById(id);
};