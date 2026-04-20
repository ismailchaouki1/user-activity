const express = require('express');
const Event = require('../models/Event');
const { authenticateApiKey } = require('../middleware/apiKeyAuth');
const { authenticateJWT } = require('../middleware/auth');
const { validateEvent, validateEventQuery } = require('../middleware/validate');

const router = express.Router();

// POST /api/events - Ingest new event (requires API Key)
router.post('/', authenticateApiKey, validateEvent, async (req, res) => {
  try {
    // Fix for req.ip - use a safer approach
    const getClientIp = (req) => {
      return (
        req.headers['x-forwarded-for'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.ip ||
        'unknown'
      );
    };

    const eventData = {
      app_id: req.body.app_id,
      user_id: req.body.user_id,
      user_email: req.body.user_email,
      action: req.body.action,
      resource_type: req.body.resource_type,
      resource_id: req.body.resource_id,
      metadata: req.body.metadata,
      ip_address: getClientIp(req),
      user_agent: req.headers['user-agent'] || 'unknown',
    };

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      message: 'Event logged successfully',
      event,
    });
  } catch (error) {
    console.error('Event ingestion error:', error);
    res.status(500).json({
      error: 'Failed to log event',
      message: error.message || 'Internal server error',
    });
  }
});

// GET /api/events - Query events (requires JWT)
router.get('/', authenticateJWT, validateEventQuery, async (req, res) => {
  try {
    const {
      app_id,
      user_id,
      user_email,
      action,
      resource_type,
      from,
      to,
      page = 1,
      limit = 50,
    } = req.query;

    const filters = {
      app_id,
      user_id,
      user_email,
      action,
      resource_type,
      from,
      to,
    };

    // Remove undefined filters
    Object.keys(filters).forEach((key) => filters[key] === undefined && delete filters[key]);

    const result = await Event.findAll(filters, parseInt(page), parseInt(limit));

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Event query error:', error);
    res.status(500).json({
      error: 'Failed to fetch events',
      message: error.message || 'Internal server error',
    });
  }
});

// GET /api/events/:id - Get single event (requires JWT)
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        error: 'Event not found',
        message: 'Event with ID  does not exist ',
      });
    }

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      error: 'Failed to fetch event',
      message: error.message || 'Internal server error',
    });
  }
});

module.exports = router;
