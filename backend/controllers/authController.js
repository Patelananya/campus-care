const User = require('../models/User');
const { generateToken, hashPassword, comparePassword } = require('../utils/auth');
const db = require('../config/db');

// Student Registration
const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    User.findByEmail(email, db, async (err, existingUser) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create new user
      const newUser = {
        name,
        email,
        password: hashedPassword,
        role: 'student'
      };

      User.create(newUser, db, (err, user) => {
        if (err) {
          return res.status(500).json({ message: 'Error creating user', error: err });
        }

        // Generate token
        const token = generateToken(user);
        
        // Remove password from response
        delete user.password;

        res.status(201).json({
          message: 'Student registered successfully',
          user,
          token
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    User.findByEmail(email, db, async (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Compare passwords
      const isMatch = await comparePassword(password, user.password);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken(user);
      
      // Remove password from response
      delete user.password;

      res.status(200).json({
        message: 'Login successful',
        user,
        token
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin creates Manager
const createManager = async (req, res) => {
  try {
    // Only admin can create managers
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { name, email, password, department } = req.body;

    // Check if user already exists
    User.findByEmail(email, db, async (err, existingUser) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create new manager
      const newManager = {
        name,
        email,
        password: hashedPassword,
        role: 'manager',
        department
      };

      User.create(newManager, db, (err, manager) => {
        if (err) {
          return res.status(500).json({ message: 'Error creating manager', error: err });
        }

        // Remove password from response
        delete manager.password;

        res.status(201).json({
          message: 'Manager created successfully',
          manager
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all managers (Admin only)
const getAllManagers = async (req, res) => {
  try {
    console.log('getAllManagers called by user:', req.user);
    
    // Only admin can access this
    if (req.user.role !== 'admin') {
      console.log('Access denied: User is not admin');
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    console.log('Fetching all managers from database');
    
    User.getAllManagers(db, (err, managers) => {
      if (err) {
        console.error('Database error while fetching managers:', err);
        return res.status(500).json({ message: 'Database error', error: err });
      }

      console.log('Managers fetched successfully:', managers.length);
      
      // Remove passwords from response
      const sanitizedManagers = managers.map(manager => {
        const { password, ...managerWithoutPassword } = manager;
        return managerWithoutPassword;
      });

      res.status(200).json({
        message: 'Managers retrieved successfully',
        managers: sanitizedManagers
      });
    });
  } catch (error) {
    console.error('Server error in getAllManagers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerStudent,
  login,
  createManager,
  getAllManagers
};