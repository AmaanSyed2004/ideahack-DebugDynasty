import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useTicket } from "../context/TicketContext";

const TicketSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ticket = location.state?.ticket;
  const { resolveTicket, setCurrentTicket, currentTicket } = useTicket();

  // If no ticket details are available, redirect back to Raise Query.
  if (!ticket) {
    navigate("/raise-query");
    return null;
  }

  // When the button is clicked, set the current ticket in context and send the live request.
  const handleInstantAppointment = async () => {
    try {
      setCurrentTicket(ticket.ticketID);
      console.log(currentTicket)
      await resolveTicket(ticket.ticketID);
      navigate("/appointment/instant");
    } catch (error) {
      console.error("Error starting instant appointment", error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="bg-white max-w-2xl mx-auto p-8 rounded-3xl shadow-xl">
          <div className="text-center">
            <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-blue-900 mb-2">
              Service Ticket Created!
            </h2>
            <p className="text-gray-600 text-lg">
              Your ticket number is: {ticket.ticketID}
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100 mb-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              Summary of the Query
            </h3>
            <div className="space-y-3">
              <p className="text-gray-700">
                <strong>Submission Type:</strong> {ticket.type}
              </p>
              <p className="text-gray-700">
                <strong>Department Allotted:</strong> {ticket.department}
              </p>
              <p className="text-gray-700">
                <strong>Transcript:</strong> {ticket.transcript}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleInstantAppointment}
              className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl hover:shadow-md transition-all"
            >
              Book Instant Appointment
            </button>
            <button
              onClick={() => navigate("/appointment/schedule")}
              className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl hover:shadow-md transition-all"
            >
              Book Future Appointment
            </button>
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/my-queries"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              View All Queries
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSummary;
