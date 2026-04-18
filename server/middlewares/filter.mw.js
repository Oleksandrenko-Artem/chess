module.exports.filterGameMode = async (req, res, next) => {
    try {
        const { mode } = req.query;
        req.filter = {};
        if (mode) {
            req.filter.mode = mode;
        }
        next();
    } catch (error) {
        next(error);
    }
};