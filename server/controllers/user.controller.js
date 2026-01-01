const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require("../models/User");
const CONSTANTS = require('../constants');

module.exports.registerUser = async (req, res, next) => { 
    try {
        const { name, email, password } = req.body;
        const exists = await User.findOne({ email });
        if (exists) {
            throw createError(409, 'Email already registeres');
        }
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hash });
        res.status(201).send({ data: user });
    } catch (error) {
        next(error);
    }
};
module.exports.loginUser = async (req, res, next) => { 
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw createError(404, 'Invalid data');
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw createError(401, 'Unauthorized');
        }
        const token = jwt.sign({ id: user._id }, CONSTANTS.JWT_SECRET, { expiresIn: CONSTANTS.JWT_EXPIRES });
        res.status(200).send({ data: { token, user } });
    } catch (error) {
        next(error);
    }
};
module.exports.getUserAccount = async (req, res, next) => {
    try {
        res.status(200).send({ data: req.user });
    } catch (error) {
        next(error);
    }
};
module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).send({ data: users });
    } catch (error) {
        next(error);
    }
};
module.exports.patchUser = async (req, res, next) => {
    try {
        const updateData = req.body;
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        const updateUser = await User.findByIdAndUpdate(req.params.idUser, updateData, { new: true });
        if(!updateUser){
            throw createError(404, "User not found")
        }
        res.status(200).send({ data: updateUser });
    } catch (error) {
        if (error.code === 11000) {
            return next(createError(409, 'Email is already exists'));
        }
        next(error);
    }
};