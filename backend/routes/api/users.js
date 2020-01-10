const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../../controllers/auth');
const Users = mongoose.model('Users');
const user_controller = require('../../controllers/users');
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
router.post('/', auth.optional, (req, res) => {
    user_controller.createUser(req, res);
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
    user_controller.login(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res) => {
    user_controller.getCurrentUser(req, res)
});

router.delete('/', auth.optional, (req,res) => {
   user_controller.deleteAll(req,res);
});
router.get('/', auth.optional, (req,res) => {
   user_controller.getAll(req,res);
});

module.exports = router;

