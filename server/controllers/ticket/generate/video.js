// video.js
const Department = require("../../../models/Department");
const ServiceTicket = require("../../../models/ServiceTicket");
const TicketData = require("../../../models/TicketData");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const { exec } = require("child_process");

const generateVideoTicket = async (req, res) => {
  const video = req.file;
  if (!video) {
    return res.status(400).json({ message: "No video found" });
  }
  try {
    // Prepare form-data for FastAPI endpoint call
    const formData = new FormData();
    formData.append("file", fs.createReadStream(video.path));

    // Call the FastAPI service to process the video file
    const fastApiResponse = await axios.post("http://localhost:8000/query/file", formData, {
      headers: formData.getHeaders(),
    });
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
    const filePath = path.join("uploads/video", video.filename);

    await TicketData.create({
      ticketID: ticket.ticketID,
      content: filePath,
      type: "video",
      transcription: transcribed_text,
    });

    // Convert .webm to .mp4 using FFmpeg
    const mp4Path = filePath.replace(".webm", ".mp4");
    exec(`"C:\\DOCS_DOWN\\ffmpeg-7.1.1-full_build\\ffmpeg-7.1.1-full_build\\bin\\ffmpeg.exe" -y -i "${filePath}" -c:v libx264 -preset veryfast -crf 23 -c:a aac -b:a 128k "${mp4Path}"`, (err, stdout, stderr) => {
      if (err) {
        console.error("Error converting .webm to .mp4:", err);
      } else {
        console.log("Successfully converted .webm to .mp4 at:", mp4Path);
      }
    });
    
    return res.status(201).json({
      message: "Ticket created",
      ticket: {
        ticketID: ticket.ticketID,
        type: "video",
        department: mappedDept,
        transcript: transcribed_text,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.toString() });
  }
};

module.exports = generateVideoTicket;
