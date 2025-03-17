// text.js
const Department = require("../../../models/Department");
const ServiceTicket = require("../../../models/ServiceTicket");
const TicketData = require("../../../models/TicketData");
const axios = require("axios");

const generateTextTicket = async (req, res) => {
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ message: "No data found" });
  }
  try {
    // Call the FastAPI service to process the text query
    const params = new URLSearchParams();
    params.append("text", data);
    const fastApiResponse = await axios.post("http://localhost:8000/query/text", params);
    const { transcribed_text, department } = fastApiResponse.data;
    
    // Map the expanded ML department name to the short database name
    const departmentMapping = {
      "Loan Services Department": "loan",
      "Deposit & Account Services Department": "deposit",
      "Customer Grievance & Fraud Resolution Department": "grievance",
      "Operations & Service Requests Department": "operation"
    };
    const mappedDept = departmentMapping[department] || department;

    const sentiment = 0.5; // Dummy value
    const priority = 0.5;  // Dummy value
    
    // Lookup department using the mapped name
    const dep = await Department.findOne({ where: { departmentName: mappedDept } });
    if (!dep) {
      return res.status(400).json({ message: `Department "${mappedDept}" not found in DB.` });
    }
    
    const ticket = await ServiceTicket.create({
      userID: req.user.id,
      departmentID: dep.departmentID,
      priority,
      sentiment,
    });
    
    await TicketData.create({
      ticketID: ticket.ticketID,
      content: data,
      type: "text",
      transcription: transcribed_text,
    });
    
    return res.status(201).json({
      message: "Ticket created",
      ticket: {
        ticketID: ticket.ticketID,
        type: "text",
        department: mappedDept,
        transcript: transcribed_text,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.toString() });
  }
};

module.exports = generateTextTicket;
