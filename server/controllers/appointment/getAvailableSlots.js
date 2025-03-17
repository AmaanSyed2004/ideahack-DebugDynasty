const { Op } = require("sequelize");
const Appointment = require("../../models/Appointment");
const Department = require("../../models/Department");
const generateSlots= require("../../utils/generateSlots");
const getAvailableSlots = async (req, res) => {
  const {dep}= req.query;
    if(!dep){
        return res.status(400).json({message: "Department is required"});
    }

  const slots = generateSlots();

  const department = await Department.findOne({
    where: { departmentName: dep },
  });
  const appointments = await Appointment.findAll({
    where: {
      timeSlot: { [Op.in]: slots },
      departmentID: department.departmentID,
    },
  });

  const bookedSlots = appointments.map(appointment => appointment.timeSlot);
  const available = slots.filter(slot => !bookedSlots.includes(slot));
  
  res.json({ availableSlots: available });
};
module.exports = getAvailableSlots;