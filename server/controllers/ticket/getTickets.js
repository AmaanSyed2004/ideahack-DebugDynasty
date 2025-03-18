const ServiceTicket = require("../../models/ServiceTicket");
const User = require("../../models/User");
const getTickets = async(req,res)=>{
    const tickets = await ServiceTicket.findAll({
        where: {userID: req.user.id, status: 'completed'},
    });
    return res.status(200).json({tickets});
}
module.exports = getTickets;