const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class App {
  // Generate API key
  static generateApiKey() {
    const prefix = 'ak_';
    const random = crypto.randomBytes(32).toString('hex');
    return {
      apiKey: prefix + random,
      prefix: prefix + random.substring(0, 8),
    };
  }

  // Hash API key
  static async hashApiKey(apiKey) {
    return await bcrypt.hash(apiKey, 10);
  }

  // Create new app
  static async create(appData) {
    const { id, name, description, apiKey } = appData;
    const apiKeyHash = await this.hashApiKey(apiKey);
    const apiKeyPrefix = apiKey.substring(0, 10);

    try {
      const [result] = await pool.query(
        `INSERT INTO apps (id, name, description, api_key_hash, api_key_prefix) 
                 VALUES (?, ?, ?, ?, ?)`,
        [id, name, description, apiKeyHash, apiKeyPrefix],
      );
      return { id, name, description, api_key_prefix: apiKeyPrefix };
    } catch (error) {
      throw error;
    }
  }

  // Find app by ID
  static async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT id, name, description, api_key_prefix, is_active, created_at FROM apps WHERE id = ?',
        [id],
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Verify API key
  static async verifyApiKey(appId, apiKey) {
    try {
      const [rows] = await pool.query('SELECT api_key_hash, is_active FROM apps WHERE id = ?', [
        appId,
      ]);

      if (!rows[0] || !rows[0].is_active) return false;

      return await bcrypt.compare(apiKey, rows[0].api_key_hash);
    } catch (error) {
      throw error;
    }
  }

  // Get all apps
  static async findAll() {
    try {
      const [rows] = await pool.query(
        'SELECT id, name, description, api_key_prefix, is_active, created_at FROM apps ORDER BY created_at DESC',
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Delete app
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM apps WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = App;
