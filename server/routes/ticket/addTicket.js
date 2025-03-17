const express= require('express');
const addTicketRouter= express.Router();

const generateTextTicket= require('../../controllers/ticket/generate/text');
const { authenticateJWT, authenticateCustomer } = require('../../middleware/authMiddleware');
const uploadAudio = require('../../middleware/uploadAudio');
const generateAudioTicket = require('../../controllers/ticket/generate/audio');
const generateVideoTicket = require('../../controllers/ticket/generate/video');
const uploadVideo= require('../../middleware/uploadVideo')
addTicketRouter.post('/text',authenticateJWT, authenticateCustomer, generateTextTicket);
addTicketRouter.post('/audio',authenticateJWT, authenticateCustomer, uploadAudio.single("audio"),generateAudioTicket )
addTicketRouter.post('/video',authenticateJWT, authenticateCustomer, uploadVideo.single("video"),generateVideoTicket )
module.exports= addTicketRouter;