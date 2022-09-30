const server = require('./files_to_server')
const db = require('./files_to_db')

module.exports = (req, res, next) => {
    const type = req.query.type;

    switch (type) {
        case 'db':
            return db(req, res, next);
        case 'server':
            return server(req, res, next);
        case 'none':
            return next();
        default:
            return res.status(403).send();
    }
}