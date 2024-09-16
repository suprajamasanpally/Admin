const EmployeeModel = require('../Models/Employee');
const jwt = require('jsonwebtoken');

// Middleware to authenticate user and set req.userId
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assumes Bearer token
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Set the userId for later use
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to check if the user is SuperAdmin
const requireSuperAdmin = async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'Unauthorized' }); // Ensure token was validated
  }

  try {
    const user = await EmployeeModel.findById(req.userId);
    if (user && user.role === 'SuperAdmin') {
      return next(); // Proceed if SuperAdmin
    } else {
      return res.status(403).json({ error: 'Access denied. SuperAdmin role required.' });
    }
  } catch (err) {
    console.error('Error fetching user:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Middleware to check user role dynamically
const requireRole = (role) => {
  return async (req, res, next) => {
    try {
      const user = await EmployeeModel.findById(req.userId);
      if (user && user.role === role) {
        next(); // Proceed if the correct role
      } else {
        res.status(403).json({ error: `Access denied. ${role} role required.` });
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};

module.exports = { authenticate, requireSuperAdmin, requireRole };
