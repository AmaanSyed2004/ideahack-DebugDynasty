const { Op } = require("sequelize");
const Appointment = require("../../models/Appointment");
const Worker = require("../../models/Worker");
const Department = require("../../models/Department");
const generateSlots = require("../../utils/generateSlots");
const User= require("../../models/User");
const bookAppointment = async (req, res) => {
  const { slot, dep } = req.body;
  const customerID = req.user.id;
  if (!customerID || !slot) {
    return res
      .status(400)
      .json({ message: "Please provide customer ID and slot" });
  }
  if(!dep){
    return res.status(400).json({ message: "Department is required" });
  }

  const validSlots = generateSlots();
  if (!validSlots.includes(slot)) {
    return res.status(400).json({ message: "Invalid or expired time slot" });
  }

  const department = await Department.findOne({
    where: { departmentName: dep },
  });
  if (!department) {
    return res.status(404).json({ message: "Department not found" });
  }

  const appointments = await Appointment.findAll({
    where: { timeSlot: slot, departmentID: department.departmentID },
  });

  const busyWorkerIDs = appointments.map((app) => app.workerID);

  const availableWorkers = await Worker.findAll({
    where: {
      userID: { [Op.notIn]: busyWorkerIDs },
      status: { [Op.not]: "handling_live" },
      departmentID: department.departmentID, // Assuming worker is tied to department
    },
  });

  if (!availableWorkers.length) {
    return res
      .status(400)
      .json({ message: "No workers available for this slot" });
  }

  // Calculate round robin index
  const index = department.roundRobinIndex % availableWorkers.length;
  const worker = availableWorkers[index];

  // Increment and update the department's roundRobinIndex
  department.roundRobinIndex = department.roundRobinIndex + 1;
  await department.save();

  await Appointment.create({
    customerID,
    workerID: worker.userID,
    timeSlot: slot,
    departmentID: department.departmentID,
  });
  const user= await User.findByPk(worker.userID);
  return res.json({ message: "Appointment booked", worker:{
    name: user.fullName,
    department: department.departmentName,
    timeSlot: slot
  } });
};

module.exports = bookAppointment;
