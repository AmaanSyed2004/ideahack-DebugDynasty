const { Op } = require("sequelize");
const Appointment = require("../../models/Appointment");
const Worker = require("../../models/Worker");
const Department = require("../../models/Department");
const generateSlots = require("../../utils/generateSlots");

let roundRobinIndex = 0;

const bookAppointment = async (req, res) => {
  const { slot, dep } = req.body;
  const customerID = req.user.id;
  if (!customerID || !slot) {
    return res
      .status(400)
      .json({ message: "Please provide customer ID and slot" });
  }
  if(!dep){
    return res.status(400).json({message: "Department is required"});
}

  // Validate the provided slot string.
  // generateSlots() returns only valid slots (with 2+ hours buffer, proper hours, etc.)
  const validSlots = generateSlots();
  if (!validSlots.includes(slot)) {
    return res.status(400).json({ message: "Invalid or expired time slot" });
  }

  // Check if any appointments exist for the given slot.
  // (Since slots are generated discretely, a simple equality check works here.)
  const department = await Department.findOne({
    where: { departmentName: dep },
  });
  const appointments = await Appointment.findAll({
    where: { timeSlot: slot },
    departmentID: department.departmentID
  });

  const busyWorkerIDs = appointments.map((app) => app.workerID);

  const availableWorkers = await Worker.findAll({
    where: {
      userID: { [Op.notIn]: busyWorkerIDs },
      status: { [Op.not]: "handling_live" },
    },
  });

  if (!availableWorkers.length) {
    return res
      .status(400)
      .json({ message: "No workers available for this slot" });
  }

  // Use round-robin selection for available workers.
  const worker = availableWorkers[roundRobinIndex % availableWorkers.length];
  roundRobinIndex++;

  // Create the appointment with the slot stored as a string.
  await Appointment.create({
    customerID,
    workerID: worker.userID,
    timeSlot: slot,
    departmentID: department.departmentID,
  });

  res.json({ message: "Appointment booked", workerID: worker.userID });
};

module.exports = bookAppointment;
