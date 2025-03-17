const express= require('express');
const getAvailableSlots = require('../../controllers/appointment/getAvailableSlots');
const { authenticateJWT, authenticateCustomer, authenticateWorker } = require('../../middleware/authMiddleware');
const bookAppointment = require('../../controllers/appointment/book');
const getAppointmentUser = require('../../controllers/appointment/getAppointmentUser');
const getAppointmentWorker = require('../../controllers/appointment/getAppointmentWorker');

const appointmentRouter= express.Router();

appointmentRouter.get('/slots', authenticateJWT, getAvailableSlots);
appointmentRouter.post('/book', authenticateJWT, authenticateCustomer, bookAppointment)
appointmentRouter.get('/customer/', authenticateJWT, authenticateCustomer, getAppointmentUser)
appointmentRouter.get('/worker/', authenticateJWT, authenticateWorker, getAppointmentWorker)
module.exports= appointmentRouter;