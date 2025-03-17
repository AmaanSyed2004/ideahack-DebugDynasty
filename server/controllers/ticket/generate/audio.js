// audio.js
const Department = require("../../../models/Department");
const ServiceTicket = require("../../../models/ServiceTicket");
const TicketData = require("../../../models/TicketData");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const generateAudioTicket = async (req, res) => {
  const audio = req.file;
  if (!audio) {
    return res.status(400).json({ message: "No audio found" });
  }
  try {
    // Prepare form-data for FastAPI endpoint call
    const formData = new FormData();
    formData.append("file", fs.createReadStream(audio.path));

    // Call the FastAPI service to process the audio file
    const fastApiResponse = await axios.post("http://localhost:8000/query/file", formData, {
      headers: formData.getHeaders(),
    });
    const { transcribed_text, department } = fastApiResponse.data;

    // Map ML expanded names to the short department names in the database
    const departmentMapping = {
      "Loan Services Department": "loan",
      "Deposit & Account Services Department": "deposit",
      "Customer Grievance & Fraud Resolution Department": "grievance",
      "Operations & Service Requests Department": "operation"
    };
    const mappedDept = departmentMapping[department] || department;

    const sentiment = 0.5; // Dummy value (or integrate sentiment analysis)
    const priority = 0.5;  // Dummy value
    const dep = await Department.findOne({ where: { departmentName: mappedDept } });

    // Check if department exists before proceeding
    if (!dep) {
      return res.status(400).json({ message: `Department "${mappedDept}" not found in DB.` });
    }

    const ticket = await ServiceTicket.create({
      userID: req.user.id,
      departmentID: dep.departmentID,
      priority,
      sentiment,
    });
    const filePath = path.join("uploads/audio", audio.filename);

    await TicketData.create({
      ticketID: ticket.ticketID,
      content: filePath,
      type: "audio",
      transcription: transcribed_text, // Use the actual transcript
    });
    return res.status(201).json({
      message: "Ticket created",
      ticket: {
        ticketID: ticket.ticketID,
        type: "audio",
        department: mappedDept,
        transcript: transcribed_text,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.toString() });
  }
};


module.exports = generateAudioTicket;
