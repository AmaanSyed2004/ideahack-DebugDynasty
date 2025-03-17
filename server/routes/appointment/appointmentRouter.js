const express= require('express');
const getAvailableSlots = require('../../controllers/appointment/getAvailableSlots');
const { authenticateJWT, authenticateCustomer } = require('../../middleware/authMiddleware');
const bookAppointment = require('../../controllers/appointment/book');

const appointmentRouter= express.Router();

appointmentRouter.get('/slots', authenticateJWT, getAvailableSlots);
appointmentRouter.post('/book', authenticateJWT, authenticateCustomer, bookAppointment)

module.exports= appointmentRouter;