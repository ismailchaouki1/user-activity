const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { pool } = require('../config/db');
const Admin = require('../models/Admin');
const { validateLogin } = require('../middleware/validate');

const router = express.Router();

// POST /api/auth/login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('========== LOGIN DEBUG ==========');
    console.log('1. Received username:', username);
    console.log('2. Received password:', password);

    // Method 1: Using Admin model
    const admin = await Admin.findByUsername(username);

    console.log('3. Admin found via model:', admin ? 'YES' : 'NO');
    if (admin) {
      console.log('4. Admin ID:', admin.id);
      console.log('5. Admin username:', admin.username);
      console.log('6. Stored hash (first 30 chars):', admin.password_hash?.substring(0, 30));
    }

    if (!admin) {
      console.log('7. Admin not found - returning 401');
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Username or password is incorrect',
      });
    }

    // Method 2: Direct bcrypt compare (bypassing model method)
    let isValid = false;
    try {
      isValid = await bcrypt.compare(password, admin.password_hash);
      console.log('8. bcrypt.compare result:', isValid);
    } catch (compareError) {
      console.error('9. bcrypt.compare error:', compareError);
      isValid = false;
    }

    // Method 3: Also try Admin.verifyPassword method
    let isValidViaModel = false;
    try {
      isValidViaModel = await Admin.verifyPassword(password, admin.password_hash);
      console.log('10. Admin.verifyPassword result:', isValidViaModel);
    } catch (modelError) {
      console.error('11. Admin.verifyPassword error:', modelError);
    }

    if (!isValid && !isValidViaModel) {
      console.log('12. Password invalid - returning 401');
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Username or password is incorrect',
      });
    }

    // Update last login
    await Admin.updateLastLogin(admin.id);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    );

    console.log('13. Login SUCCESS! Token generated');
    console.log('================================\n');

    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message || 'Internal server error',
    });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const [rows] = await pool.query('SELECT id FROM admins WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.json({
        success: true,
        message: 'If your email is registered, you will receive a reset link.',
      });
    }

    const adminId = rows[0].id;
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000);

    await pool.query('UPDATE admins SET reset_token = ?, reset_expires = ? WHERE id = ?', [
      token,
      expires,
      adminId,
    ]);

    const resetLink = `http://localhost:5173/login?token=${token}`;
    console.log('\n🔐 PASSWORD RESET LINK:\n', resetLink, '\n');

    res.json({
      success: true,
      message: 'If your email is registered, you will receive a reset link.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id FROM admins WHERE reset_token = ? AND reset_expires > NOW()',
      [token],
    );
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const adminId = rows[0].id;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE admins SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?',
      [hashedPassword, adminId],
    );

    res.json({ success: true, message: 'Password has been reset. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

module.exports = router;
