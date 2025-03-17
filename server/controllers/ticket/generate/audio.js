//this route recives a ticket with the mode set as "audio"
const Department = require("../../../models/Department");
const ServiceTicket = require("../../../models/ServiceTicket");
const TicketData = require("../../../models/TicketData");
const path= require('path')
const generateAudioTicket = async (req, res) => {
  const audio = req.file;
  if (!audio) {
    return res.status(400).json({ message: "No audio found" });
  }
  try {
    const sentiment= 0.5 //dummy
    const priority= 0.5 //dummy
    const department= "loan" //dummy
    const dep= await Department.findOne({where: {departmentName: department}})
    const ticket = await ServiceTicket.create({
      userID: req.user.id,
      departmentID: dep.departmentID,
      priority,
      sentiment
    })
    const filePath = path.join('uploads/audio', audio.filename);

    await TicketData.create({
      ticketID: ticket.ticketID,
      content: filePath, 
      type: "audio"
    });
    return res.status(201).json({
      message: "Ticket created",
      ticket: {
        ticketID: ticket.ticketID,
        type: "<audio/video>",
        department: department,
        transcript: "Dummy transcript for " + "<audio/video>",
      },
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
};

module.exports= generateAudioTicket;