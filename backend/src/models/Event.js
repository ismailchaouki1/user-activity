const { pool } = require('../config/db');

class Event {
  // Create new event
  static async create(eventData) {
    const {
      app_id,
      user_id,
      user_email,
      action,
      resource_type,
      resource_id,
      metadata,
      ip_address,
      user_agent,
    } = eventData;

    try {
      const [result] = await pool.query(
        `INSERT INTO events 
                 (app_id, user_id, user_email, action, resource_type, resource_id, metadata, ip_address, user_agent) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          app_id,
          user_id,
          user_email,
          action,
          resource_type,
          resource_id,
          metadata ? JSON.stringify(metadata) : null,
          ip_address,
          user_agent,
        ],
      );

      return { id: result.insertId, ...eventData };
    } catch (error) {
      throw error;
    }
  }

  // Get events with filters and pagination
  static async findAll(filters = {}, page = 1, limit = 50) {
    const conditions = [];
    const params = [];

    // Build WHERE clause
    if (filters.app_id) {
      conditions.push('app_id = ?');
      params.push(filters.app_id);
    }
    if (filters.user_id) {
      conditions.push('user_id = ?');
      params.push(filters.user_id);
    }
    if (filters.user_email) {
      conditions.push('user_email LIKE ?');
      params.push(`%${filters.user_email}%`);
    }
    if (filters.action) {
      conditions.push('action = ?');
      params.push(filters.action);
    }
    if (filters.resource_type) {
      conditions.push('resource_type = ?');
      params.push(filters.resource_type);
    }
    if (filters.from) {
      conditions.push('created_at >= ?');
      params.push(filters.from);
    }
    if (filters.to) {
      conditions.push('created_at <= ?');
      params.push(filters.to);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM events ${whereClause}`,
      params,
    );
    const total = countResult[0].total;

    // Get paginated results
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      `SELECT * FROM events ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );

    return {
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get single event by ID
  static async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Event;
