const ServiceTicket = require("../../models/ServiceTicket");
const User = require("../../models/User");
const Department = require("../../models/Department");
const getTickets = async(req,res)=>{
    const tickets = await ServiceTicket.findAll({
      where: { userID: req.user.id },
      include: [
        {
          model: User,
          attributes: ["userID", "fullName", "email", "phoneNumber", "role"],
        },
        {
          model: Department,
          attributes: ["departmentID", "departmentName"],
        },
      ],
    });
    return res.status(200).json({tickets});
}
module.exports = getTickets;