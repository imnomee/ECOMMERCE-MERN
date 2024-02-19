const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    //if we have token in headers, verify it
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            //if any error return it
            if (err) {
                return res.status(403).json('verifyToken: Invalid Token');
            }
            //else set user with the request and forward it
            req.user = user;
            console.log(req.user);
            return next();
        });
    } else {
        return res.status(401).json('verifyToken: Not Authenticated...');
    }
};

const verifyTokenAndAuth = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            return next();
        } else {
            return res.status(403).json('verifyTokenAndAuth: Not allowed');
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            return next();
        } else {
            res.status(403).json('verifyTokenAndAdmin: Not Allowed');
        }
    });
};

module.exports = { verifyTokenAndAuth, verifyTokenAndAdmin };
