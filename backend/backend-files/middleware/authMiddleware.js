const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }

    try {
        const bearer = token.split(" ")[1] || token;
        const decoded = jwt.verify(bearer, process.env.JWT_SECRET || 'supersecretkey123');
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    return next();
};

const verifyRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Forbidden: Role not authorized" });
        }
        next();
    }
}

module.exports = { verifyToken, verifyRole };
