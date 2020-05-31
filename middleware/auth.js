const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = await jwt.verify(token,process.env.JWT_SIGN);
    } catch (error) {
        error.statusCode = 500;
        req.isAuth = false;
        return next();
    }
    if(!decodedToken) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        req.isAuth = false;
        return next();
    }
    req.userId = decodedToken.userId;
    req.isAuth = true;
    return next();
}