const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const appconfig = require('../config/appconfig.js');

const {Schema} = mongoose;

const userSchema = new Schema({
    username: String,
    email: String,
    // password
    hash: String,
    salt: String,
    pepperID: Number,
});

function pepperPassword(password, pepperID) {
    return appconfig.config["peppers"][pepperID] + password;
}

userSchema.methods.setPassword = function (password) {
    let concatPW = pepperPassword(password, appconfig.latestPepperID);
    this.pepperID = appconfig.latestPepperID;
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(concatPW, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function (password) {
    let concatPW = pepperPassword(password, this.pepperID);
    const hash = crypto.pbkdf2Sync(concatPW, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
};

userSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
    };
};

mongoose.model('Users', userSchema);