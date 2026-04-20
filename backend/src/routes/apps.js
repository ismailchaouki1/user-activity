const express = require('express');
const App = require('../models/App');
const { authenticateJWT } = require('../middleware/auth');
const { validateApp } = require('../middleware/validate');

const router = express.Router();

// POST /api/apps - Register new app (requires JWT)
router.post('/', authenticateJWT, validateApp, async (req, res) => {
  try {
    const { id, name, description } = req.body;

    // Check if app already exists
    const existingApp = await App.findById(id);
    if (existingApp) {
      return res.status(409).json({
        error: 'App already exists',
        message: `App with ID '${id}' already exists`,
      });
    }

    // Generate API key
    const { apiKey, prefix } = App.generateApiKey();

    // Create app
    const app = await App.create({
      id,
      name,
      description,
      apiKey,
    });

    res.status(201).json({
      success: true,
      message: 'App registered successfully',
      app: {
        id: app.id,
        name: app.name,
        description: app.description,
        api_key: apiKey, // Show full key only once!
        api_key_prefix: prefix,
      },
    });
  } catch (error) {
    console.error('App creation error:', error);
    res.status(500).json({
      error: 'Failed to register app',
      message: 'Internal server error',
    });
  }
});

// GET /api/apps - List all apps (requires JWT)
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const apps = await App.findAll();

    res.json({
      success: true,
      apps,
    });
  } catch (error) {
    console.error('List apps error:', error);
    res.status(500).json({
      error: 'Failed to fetch apps',
      message: 'Internal server error',
    });
  }
});

// DELETE /api/apps/:id - Remove app (requires JWT)
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const deleted = await App.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        error: 'App not found',
        message: `App with ID '${req.params.id}' does not exist`,
      });
    }

    res.json({
      success: true,
      message: 'App deleted successfully',
    });
  } catch (error) {
    console.error('Delete app error:', error);
    res.status(500).json({
      error: 'Failed to delete app',
      message: 'Internal server error',
    });
  }
});

module.exports = router;
