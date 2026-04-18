const CONSTANTS = require('../constants');

module.exports.paginate = (req, res, next) => {
    try {
        const { page, amount } = req.query;
        const limit = Number(amount) > 0 ? Number(amount) : CONSTANTS.AMOUNT;
        const skip = Number(page) > 0 ? (page - 1) * limit : 0;
        req.pagination = { limit, skip };
        next();
    } catch (error) {
        next(error);
    }
};