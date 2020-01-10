const owasp = require('owasp-password-strength-test');
const appRoot = require('app-root-path');
const mongoose = require('mongoose');

const isProduction = require(appRoot + '/app').isProduction;
/// Routing targets for users.
const User = require(appRoot + '/models/User.js').userModel;

const User_collection = mongoose.model('Users');

module.exports.createUser = (req, res) => {
    const {body: {user}} = req;
    if (!user.email) {
        return res.status(400).json({errors: {email: 'is required'}});
    }

    let findUserPromise = () => (
        new Promise((resolve, reject) => {
            User_collection.findOne({email: user.email}, (err, data) => {
                err ? reject(err) : resolve(data);
            });
        }));

    let callFindUserPromise = async () => {
        let result_user = {json: await (findUserPromise())};
        let result = {};
        if (result_user.json) {
            // Email is already known
            result = {status: 400, json: {errors: {email: 'is duplicate'}}}
        } else {
            result = {status: 200, json: {}};
        }
        return result;
    };

    callFindUserPromise().then(function (result) {
        // Check password
        let validationResult = owasp.test(user.password);
        if (!validationResult.strong) {
            result = {status: 400, json: {errors: validationResult.errors}};
        }
        if (result["status"] === 200) {
            const finalUser = new User_collection(user);
            finalUser.setPassword(user.password);
            return finalUser.save()
                .then(() => {
                    result.json = {user: finalUser.toAuthJSON()};
                    res.status(result["status"]).json(result["json"]);
                    return result;
                })
        } else {
            res.status(result["status"]).json(result["json"]);
        }
    });
};

module.exports.login = (req, res, next) => {
    const {body: {user}} = req;

    if (!user.email) {
        return res.status(400).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if (!user.password) {
        return res.status(400).json({
            errors: {
                password: 'is required',
            },
        });
    }

    return passport.authenticate('local', {session: false}, (err, passportUser, info) => {
        if (err) {
            return next(err);
        }

        if (passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return res.json({user: user.toAuthJSON()});
        }

        return status(400).info;
    })(req, res, next);
};

module.exports.getCurrentUser = (req, res) => {
    const {payload: {id}} = req;

    return User_collection.findById(id)
        .then((user) => {
            if (!user) {
                return res.sendStatus(400);
            }

            return res.json({user: user.toAuthJSON()});
        });
};

module.exports.deleteAll = async (req, res) => {
    if (isProduction) {
        res.sendStatus(405);
        return;
    }
    let result = await User_collection.deleteMany({}, (err, result) => {
        if (err) throw err;
        return result;
    });
    res.status(200).json({result: result});
};

module.exports.getAll = async (req, res) => {
    if (isProduction) {
        res.sendStatus(405);
        return;
    }
    let result = await User_collection.find((err, result) => {
        if (err) throw err;
        return result;
    });
    res.status(200).json({users: result});
};
