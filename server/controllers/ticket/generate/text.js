//this route recives a ticket with the mode set as "text"
const Department = require("../../../models/Department");
const ServiceTicket = require("../../../models/ServiceTicket");
const TicketData = require("../../../models/TicketData");

const generateTextTicket = async (req, res) => {
  /* working:
   * 1. get data from user: content, userID is req.user, and deparment name will be determined using ML algo further below
   * 2. determine priority too, using ML algo, even though not needed rn
   * 3. determine sentiment score
   */
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ message: "No data found" });
  }
  console.log(req.user)
  try {
    const sentiment = 0.5 //dummy
    const priority = 0.5 //dummy
    const department = "loan" //dummy
    const dep = await Department.findOne({ where: { departmentName: department } })
    const ticket = await ServiceTicket.create({
      userID: req.user.id,
      departmentID: dep.departmentID,
      priority,
      sentiment
    })
    await TicketData.create({
      ticketID: ticket.ticketID,
      content: data,
      type: "text"
    })
    return res.status(201).json({
      message: "Ticket created",
      ticket: {
        ticketID: ticket.ticketID,
        type: "text",
        department: department, // dummy value (e.g., "loan")
        transcript: data, // for text, the submitted text is the transcript
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500);
  }
};

module.exports = generateTextTicket;