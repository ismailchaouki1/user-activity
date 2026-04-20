const express = require('express');
const { pool } = require('../config/db');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

// GET /api/stats - Dashboard statistics (requires JWT)
router.get('/', authenticateJWT, async (req, res) => {
  try {
    // Total events count
    const [totalEvents] = await pool.query('SELECT COUNT(*) as count FROM events');

    // Events last 7 days
    const [last7Days] = await pool.query(`
            SELECT DATE(created_at) as date, COUNT(*) as count 
            FROM events 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        `);

    // Top actions
    const [topActions] = await pool.query(`
            SELECT action, COUNT(*) as count 
            FROM events 
            GROUP BY action 
            ORDER BY count DESC 
            LIMIT 5
        `);

    // Unique users
    const [uniqueUsers] = await pool.query(`
            SELECT COUNT(DISTINCT user_id) as count 
            FROM events
        `);

    // Active apps
    const [activeApps] = await pool.query(`
            SELECT COUNT(DISTINCT app_id) as count 
            FROM events
        `);

    res.json({
      success: true,
      stats: {
        total_events: totalEvents[0].count,
        unique_users: uniqueUsers[0].count,
        active_apps: activeApps[0].count,
        last_7_days: last7Days,
        top_actions: topActions,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: 'Internal server error',
    });
  }
});

module.exports = router;
