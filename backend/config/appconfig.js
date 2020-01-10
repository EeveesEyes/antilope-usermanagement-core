const fs = require('fs');

let appconfig = fs.readFileSync(appRoot() + '/config/appconfig.json');
let config = JSON.parse(appconfig);

let latestPepperID = Math.max(...Object.keys(config["peppers"]).map(function (item) {
    if (!item) {
        throw ('Missing pepper! Run config/generateNewPepper.py!');
    }
    return parseInt(item, 10);
}));

module.exports = {config: config, latestPepperID: latestPepperID};