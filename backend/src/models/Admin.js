const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

class Admin {
  // Find admin by username or email
  static async findByUsername(username) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM admins WHERE username = ? OR email = ? LIMIT 1',
        [username, username],
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Find admin by ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT id, username, email, created_at, last_login FROM admins WHERE id = ?',
        [id],
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Update last login timestamp
  static async updateLastLogin(id) {
    try {
      await pool.query('UPDATE admins SET last_login = NOW() WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = Admin;
