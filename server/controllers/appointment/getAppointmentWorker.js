const Appointment= require("../../models/Appointment");
const getAppointmentWorker = async (req, res) => {
    const userID = req.user.id;
    if (!userID) {
        return res.status(400).json({ message: "Please provide user ID" });
    }
    const appointments = await Appointment.findAll({
        where: { workerID:userID },
        
    });
    if (!appointments || appointments.length === 0) {
        return res.status(404).json({
            message: "No appointments found",
        });
    }
    return res.status(200).json({
        appointments
    });
};

module.exports = getAppointmentWorker;