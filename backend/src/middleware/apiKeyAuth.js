const App = require('../models/App');

// API Key authentication for event ingestion
const authenticateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const appId = req.body.app_id || req.query.app_id;

  if (!apiKey) {
    return res.status(401).json({
      error: 'API key required',
      message: 'Please provide x-api-key header',
    });
  }

  if (!appId) {
    return res.status(400).json({
      error: 'app_id required',
      message: 'app_id is required in request body',
    });
  }

  try {
    const isValid = await App.verifyApiKey(appId, apiKey);

    if (!isValid) {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'The provided API key is invalid or app is inactive',
      });
    }

    req.app = { id: appId };
    next();
  } catch (error) {
    console.error('API Key auth error:', error);
    return res.status(500).json({
      error: 'Authentication error',
      message: 'Internal server error during authentication',
    });
  }
};

module.exports = { authenticateApiKey };
