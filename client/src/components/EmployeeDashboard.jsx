import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function EmployeeDashboard() {

    function handleLogout() {
        console.log('have to build this');
    }   
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">Employee Dashboard</h1>
        <button onClick={handleLogout} className="bg-white text-blue-600 px-4 py-2 rounded">
          Logout
        </button>
      </nav>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Live Incoming Queries</h2>
        {/* Placeholder for live queries */}
        <div className="space-y-4">
          <div className="p-4 bg-white rounded shadow">Query 1 - Priority High</div>
          <div className="p-4 bg-white rounded shadow">Query 2 - Priority Medium</div>
          <div className="p-4 bg-white rounded shadow">Query 3 - Priority Low</div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Scheduled Appointments</h2>
          {/* Placeholder for appointments */}
          <div className="space-y-4">
            <div className="p-4 bg-white rounded shadow">Appointment 1 at 10:00 AM</div>
            <div className="p-4 bg-white rounded shadow">Appointment 2 at 11:30 AM</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
