const ServiceTicket= require('../../../models/ServiceTicket');

exports.completeTicket = async (req, res) => {
    const { ticketID } = req.body;
    try {
        const ticket = await ServiceTicket.findByPk(ticketID);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
        if (ticket.status !== 'in_progress') return res.status(400).json({ error: 'Ticket not in progress' });

        ticket.status = 'completed';
        await ticket.save();

        res.status(200).json({ message: `Ticket ${ticketID} marked as completed.` });
    } catch (error) {
        res.status(500).json({ error: 'Error completing ticket.' });
    }
};