const createError = require('http-errors');

module.exports.validate = (shema) => async (req, res, next) => {
    try {
        req.body = await shema.validate(req.body);
        next();
    } catch (error) {
        next(createError(400, error.message));
    }
};