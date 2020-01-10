const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const https = require('https');
const fs = require('fs');
const crypto = require('crypto');
const appRoot = require('app-root-path');

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';
module.exports = isProduction;

//Initiate our app
const app = express();

//Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'passport-tutorial', cookie: {maxAge: 60000}, resave: false, saveUninitialized: false}));

if (!isProduction) {
    app.use(errorHandler());
}

//Configure Mongoose
mongoose.connect('mongodb://localhost/passport-tutorial');
mongoose.set('debug', true);

//Models & routes
require('./models/User');
require('./config/passport');
app.use(require('./routes'));

//Error handlers & middlewares
if (!isProduction) {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err,
            },
        });
    });
}

app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
});

let port = 8000;
if (isProduction) {
    const options = {
        key: fs.readFileSync(appRoot + '/config/cert/ryans-key.pem'),
        cert: fs.readFileSync(appRoot + '/config/cert/ryans-cert.pem'),
        secureOptions: crypto.SSL_OP_NO_SSLv2 | crypto.SSL_OP_NO_SSLv3 | crypto.SSL_OP_NO_TLSv1 | crypto.SSL_OP_NO_TLSv1_1,
        honorCipherOrder: true
    };
    const httpsServer = https.createServer(options, app);

    httpsServer.listen(port, err => {
        if (err) {
            console.error('Server startup failed: ', err)
        }
        console.info('==> Listening on port %s. Open up https:localhost:%s/ in your browser.', port, port)
    })
} else {
    app.listen(port, () => console.log('Server running on http://localhost:%s/', port));
}