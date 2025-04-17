const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized: No token" });

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};

module.exports = authenticate;
