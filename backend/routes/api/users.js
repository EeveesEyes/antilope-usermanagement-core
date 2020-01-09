const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');
const owasp = require('owasp-password-strength-test');
const crypto = require('crypto');
const https = require('https');

// TODO: move into frontend
function isCompromised(password) {
    let isCompromised = false;
    let shasum = crypto.createHash('sha1');
    shasum.update(password);
    let sha1HashDigest = shasum.digest('hex').toUpperCase();
    let sha1Substr = sha1HashDigest.substr(0, 5);
    https.get('https://api.pwnedpasswords.com/range/' + sha1Substr, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            let resultHashes = data.split('\r\n');
            if (resultHashes.filter(hash => sha1Substr + hash.split(':')[0] === sha1HashDigest)) {
                isCompromised = true;
            }
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
    return isCompromised;
}

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
    const {body: {user}} = req;

    if (!user.email) {
        return res.status(400).json({
            errors: {
                email: 'is required',
            },
        });
    } else if (Users.findOne({email: user.email})) {
        // Email is already known
        return res.status(400).json({
            errors: {
                email: 'is duplicate',
            },
        });
    }

    // Check password
    let result = owasp.test(user.password);
    if (!result.strong) {
        return res.status(400).json({
            errors: result.errors
        });
    }

    const finalUser = new Users(user);

    finalUser.setPassword(user.password);

    return finalUser.save()
        .then(() => res.json({user: finalUser.toAuthJSON()}));
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
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
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
    const {payload: {id}} = req;

    return Users.findById(id)
        .then((user) => {
            if (!user) {
                return res.sendStatus(400);
            }

            return res.json({user: user.toAuthJSON()});
        });
});

module.exports = router;

