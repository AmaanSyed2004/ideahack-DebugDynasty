const ServiceTicket= require('../../../models/ServiceTicket');

const getQueuePosition = async(req,res)=>{
    const ticketID = req.params.id;
    if(!ticketID){
        return res.status(400).json({
            message: 'Please provide ticket ID'
        })
    }
    const nextTickets = await ServiceTicket.findAll({
        where: { status: 'pending', resolution_mode: 'live' },
        order: [['priority_score', 'DESC'], ['createdAt', 'ASC']] // Optional: older ticket first if tie
    });
    if(!nextTickets || nextTickets.length === 0){
        return res.status(404).json({
            message: 'No tickets in queue'
        })
    }
    const position = nextTickets.findIndex(ticket => ticket.ticketID === ticketID);

    if (position === -1) {
        return res.status(404).json({
            message: 'Ticket not found in pending queue'
        });
    }

    return res.status(200).json({
        message: 'Ticket found in queue',
        position: position + 1, // Human-readable position (1-based)
        totalPendingTickets: nextTickets.length
    });
}
module.exports= getQueuePosition;