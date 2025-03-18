import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const TicketContext = createContext();

export const useTicket = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTicket must be used within a TicketProvider");
  }
  return context;
};

export const TicketProvider = ({ children }) => {
  const [currentTicket, setCurrentTicket] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [allotedMessage, setAllotedMessage] = useState(null);
  const [meetingStatus, setMeetingStatus] = useState("waiting"); // waiting, ready, active
  const [meetingRoom, setMeetingRoom] = useState(null);
  const[ticketID , setTicketID]=useState(null)

  // Now send the ticketID in the request body instead of in the URL.
  const resolveTicket = async (ticketId) => {
    try {
      const response = await axios.post(
        `http://localhost:5555/ticket/resolve/live`,
        { ticketID: ticketId },
        { withCredentials: true }
      );
      if (response.data) {
        // Save the wait time and message from the backend.
        setEstimatedTime(response.data.wait_time);
        setAllotedMessage(response.data.message);
        return response.data;
      }
    } catch (error) {
      console.error("Error resolving ticket:", error);
      toast.error(
        error.response?.data?.message || "Failed to resolve ticket"
      );
      throw error;
    }
  };

  // Poll the backend to check if the ticket has been allotted.
  const startPolling = async (ticketId) => {
    try {
      const response = await axios.get(
        `http://localhost:5555/ticket/queue/checkStatus?ticketID=${currentTicket.ticketId}`,
        { withCredentials: true }
      );
      if (response.data.alloted === true) {
        setMeetingStatus("ready");
        if (response.data.meetingRoom) {
          setMeetingRoom(response.data.meetingRoom);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error polling ticket status:", error);
      return false;
    }
  };

  return (
    <TicketContext.Provider
      value={{
        currentTicket,
        setCurrentTicket,
        estimatedTime,
        allotedMessage,
        meetingStatus,
        meetingRoom,
        resolveTicket,
        startPolling,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export default TicketProvider;
