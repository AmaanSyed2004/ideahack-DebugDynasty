const express= require('express');
const { authenticateJWT, authenticateCustomer } = require('../../middleware/authMiddleware');
const allotLive = require('../../controllers/ticket/resolution/live');
const resolutionRouter= express.Router();

resolutionRouter.post('/live',authenticateJWT,authenticateCustomer, allotLive)
module.exports= resolutionRouter;