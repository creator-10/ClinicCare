const jwt = require('jsonwebtoken')

const auth = (requiredRole = null) => {
    return async (req, res, next) => {
        try {
            let token;

            if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                token = req.headers.authorization.split(" ")[1];
            }

            if (!token) {
                return res.status(401).json({ success: false, message: 'Not Authorized Login Again' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;  // store decoded token payload (id, role, etc)

            // Role-based access check if requiredRole is provided
            if (requiredRole && decoded.role !== requiredRole) {
                return res.status(403).json({ success: false, message: 'Access denied: Insufficient permissions' });
            }

            next();
        }
        catch (error) {
            console.log(error);
            res.status(401).json({ success: false, message: 'Invalid Token' });
        }
    }
}

module.exports = auth;
