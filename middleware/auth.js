const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("🚀 ~ token:", token)
    if (!token) {
        return res.status(401).send({ status: false, msg: "Access Denied, Token Missing" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send({ status: false, msg: "Invalid Token" });
    }
};
