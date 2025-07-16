import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const authenticateUserOrAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fetch user details from database to ensure user still exists and is active
      const [users] = await pool.execute(
        'SELECT id, email, role, is_active FROM users WHERE id = ?',
        [decoded.id]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid token. User not found.' });
      }

      const user = users[0];
      
      if (!user.is_active) {
        return res.status(401).json({ error: 'Account is inactive.' });
      }

      // Check if user has required role
      if (!['admin', 'manager', 'user'].includes(user.role)) {
        return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      }

      // Attach user info to request
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role
      };

      next();
    } catch (jwtError) {
      return res.status(401).json({ error: 'Invalid token.' });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
};

export const requireAdminOrManager = (req, res, next) => {
  if (!req.user || !['admin', 'manager'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied. Admin or Manager role required.' });
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
  next();
};