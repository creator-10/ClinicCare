import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const auth = (requiredRole = null) => {
  return async (req, res, next) => {
    try {
      const header = req.headers.authorization;
      if (!header?.startsWith('Bearer '))
        return res.status(401).json({ success: false, message: 'No token provided' });

      const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);

      if (decoded.role === 'admin') {
        req.user = { id: 'admin', role: 'admin' };
        if (requiredRole && requiredRole !== 'admin')
          return res.status(403).json({ success: false, message: 'Admin only area' });
        return next();
      }

      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      req.user = { id: user._id, role: user.role };
      if (requiredRole && user.role !== requiredRole)
        return res.status(403).json({ success: false, message: 'Unauthorized' });

      next();
    } catch (err) {
      console.error('Auth error:', err);
      const msg = err.name === 'TokenExpiredError'
          ? 'Session expired'
          : 'Invalid token';
      res.status(401).json({ success: false, message: msg });
    }
  };
};

export default auth;
