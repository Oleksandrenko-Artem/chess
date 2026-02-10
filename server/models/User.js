const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 5,
        maxLength: 64,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    boardColor: {
        light: { type: String, default: '#ffdabb' },
        dark: { type: String, default: '#7e5e2e' }
    },
    rookType: {
        type: String,
        default: 'rook', // 'rook', 'sailboat', 'chariot'
    },
    avatar: {
        type: String,
        default: null,
    }
});

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;