const { authenticateJWT, authenticateWorker } = require("../../middleware/authMiddleware");
const Appointment = require("../../models/Appointment");
const ServiceTicket = require("../../models/ServiceTicket");
const User = require("../../models/User");
const getWorkerData = async(req,res)=>{
    //to return: active users, pending queries and pending appointments
    const workerID = req.user.id;
    const activeUsers = await User.findAll();
    const pendingQueries= await ServiceTicket.findAll({
        where: { status: 'pending', resolution_mode: 'live' }
    });
    const pendingAppointments= await Appointment.findAll({
        where: { status: 'scheduled', workerID }
    });

    return res.status(200).json({
        activeUsersCount:activeUsers.length,
        pendingQueriesCount:pendingQueries.length,
        pendingAppointmentsCount:pendingAppointments.length
    })
}

const express = require("express");
const router = express.Router();
router.get("/", authenticateJWT , authenticateWorker, getWorkerData);
module.exports = router;