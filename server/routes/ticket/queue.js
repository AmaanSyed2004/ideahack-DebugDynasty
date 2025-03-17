const express= require('express');
const { authenticateJWT, authenticateWorker } = require('../../middleware/authMiddleware');
const getQueue = require('../../controllers/ticket/queue/getQueue');
const getQueuePosition = require('../../controllers/ticket/queue/getQueuePosition');
const { processTicket } = require('../../controllers/ticket/queue/processTicket');
const { completeTicket } = require('../../controllers/ticket/queue/completeTicket');

const queueRouter= express.Router();

queueRouter.get('/',authenticateJWT, authenticateWorker, getQueue);
queueRouter.get('/:id', authenticateJWT, getQueuePosition);

queueRouter.post('/process', authenticateJWT, authenticateWorker, processTicket)
queueRouter.post('/complete', authenticateJWT, authenticateWorker, completeTicket)

module.exports= queueRouter;
