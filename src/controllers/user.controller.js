const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '12h';

async function register(req, res, next) {
    try {
    const { name, email, password } = req.body;
    
    // Enhanced validation
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'name is required' });
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'invalid email format' });
    }
    
    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({ error: 'password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'email already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    return res.status(201).json(user.toJSON());
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }
    
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'invalid input types' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    return res.json({ token, user: user.toJSON() });
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'invalid user id format' });
    }
    
    const user = await User.findById(id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'user not found' });
    
    return res.json(user);
  } catch (err) {
    // Handle CastError for invalid ObjectId
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'invalid user id' });
    }
    next(err);
  }
}


// Verify token: used by other services (Booking) to check token validity
async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = (authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : authHeader) || req.body.token;
    
    if (!token) {
      return res.status(401).json({ error: 'token required' });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    
    // Validate payload structure
    if (!payload.userId) {
      return res.status(401).json({ error: 'invalid token payload' });
    }
    
    const user = await User.findById(payload.userId).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ error: 'user not found' });
    }

    return res.json({ valid: true, user });
  } catch (err) {
    // JWT-specific errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'invalid token',
        reason: err.message 
      });
    }
    next(err);
  }
}


module.exports = {
  register,
  login,
  getUser,
  verifyToken
};
