const ServiceTicket= require('../../../models/ServiceTicket');

const getQueue = async(req,res)=>{
    const nextTickets = await ServiceTicket.findAll({
        where: { status: 'pending', resolution_mode: 'live' },
        order: [['priority_score', 'DESC'], ['createdAt', 'DESC']] // Optional: older ticket first if tie
    });
    if(!nextTickets || nextTickets.length === 0){
        return res.status(404).json({
            message: 'No tickets in queue'
        })
    }
    console.log(nextTickets)
    return res.status(200).json({
        nextTickets
    })
}
module.exports= getQueue;