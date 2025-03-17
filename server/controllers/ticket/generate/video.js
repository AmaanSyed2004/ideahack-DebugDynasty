//this route recives a ticket with the mode set as "audio"
const Department = require("../../../models/Department");
const ServiceTicket = require("../../../models/ServiceTicket");
const TicketData = require("../../../models/TicketData");
const path = require("path");
const { exec } = require("child_process");

const generateVideoTicket = async (req, res) => {
  const video = req.file;
  if (!video) {
    return res.status(400).json({ message: "No audio found" });
  }
  try {
    const sentiment = 0.5; //dummy
    const priority = 0.5; //dummy
    const department = "loan"; //dummy
    const dep = await Department.findOne({ where: { departmentName: department } });
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
    });

    // ---- Added lines: Convert the .webm file to .mp4 using FFmpeg ----
    // The resulting .mp4 file will have the same name, just with .mp4 extension
    const mp4Path = filePath.replace(".webm", ".mp4");
    exec(`"C:\\DOCS_DOWN\\ffmpeg-7.1.1-full_build\\ffmpeg-7.1.1-full_build\\bin\\ffmpeg.exe" -y -i "${filePath}" -c:v libx264 -preset veryfast -crf 23 -c:a aac -b:a 128k "${mp4Path}"`, (err, stdout, stderr) => {
      if (err) {
        console.error("Error converting .webm to .mp4:", err);
      } else {
        console.log("Successfully converted .webm to .mp4 at:", mp4Path);
      }
    });
    
    
    // ------------------------------------------------------------------

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

module.exports = generateVideoTicket;
