//this is a polling route, which is used to check if the ticket has been alloted to the user or not
//this is done by checking if the status of the ticket is in_progress or not
//if it is in_progress, then the ticket has been alloted
//if not, then the ticket has not been alloted

const ServiceTicket= require('../../../models/ServiceTicket');
const checkIfAlloted= async(req,res)=>{
    const {ticketID} = req.query;
    try{
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
        if(ticket.status === 'in_progress'){
            return res.status(200).json({
                alloted: true
            })
        }
        return res.status(200).json({
            alloted: false
        })
    
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports= checkIfAlloted;