const allowList = require('./allowList');

const corsOptions = {
    origin: (origin, callback) => {
        if (allowList
            .indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Blocked by CORS'))
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;