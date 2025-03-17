const ServiceTicket= require('../../../models/ServiceTicket');

exports.processTicket = async (req, res) => {
    const { ticketID } = req.body;
    try {
        const ticket = await ServiceTicket.findByPk(ticketID);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
        if (ticket.status !== 'pending') return res.status(400).json({ error: 'Ticket not pending' });

        ticket.status = 'in_progress';
        await ticket.save();

        res.status(200).json({ message: `Ticket ${ticketID} marked as in progress.` });
    } catch (error) {
        res.status(500).json({ error: `Error processing ticket: ${error}` });
    }
};
//this will be modified in case we decide to add native meets