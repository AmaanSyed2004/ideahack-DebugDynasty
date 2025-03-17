const ServiceTicket = require('../../../models/ServiceTicket');
const allotLive = async(req,res)=>{
    const {ticketID} = req.body;
    if(!ticketID){
        return res.status(400).json({
            message: 'Please provide ticket ID'
        })
    }
    const ticket = await ServiceTicket.findOne({
        where:{
            ticketID
        }
    });
    if(!ticket){
        return res.status(404).json({
            message: 'Ticket not found'
        })
    }
    if(ticket.status === 'completed'){
        return res.status(400).json({
            message: 'Ticket already completed'
        })
    }
    if(ticket.status === 'in_progress'){
        return res.status(400).json({
            message: 'Ticket already in progress'
        })
    }
    if (ticket.resolution_mode !== null){
        return res.status(400).json({
            message: 'Ticket already allotted'
        })
    }
    ticket.resolution_mode = 'live';
    await ticket.save();
    return res.status(200).json({
        message: 'Ticket allotted successfully',
        wait_time: '5 minutes'
    })
}
module.exports = allotLive;