// EmployeeDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import {
    Users,
    Clock,
    Calendar,
    MessageSquare,
    Video,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import axios from "axios";
function EmployeeDashboard() {
    const { user, logout } = useAuth();
    const employeeName = user ? user.fullName : "Employee";

    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
    };
    const[workerData,setWorkerData]=useState({
        activeUsersCount:0,
        pendingQueriesCount:0,
        pendingAppointmentsCount:0
    });
    useEffect(()=>{
        const fetchWorkerData = async () => {
            try {
                const res = await axios.get("http://localhost:5555/data/worker",{withCredentials:true});
                setWorkerData(res.data)
            } catch (err) {
                console.error(err);
            }
        };
        fetchWorkerData();
    }, [])
    const [liveQueries,setLiveQueries]=useState({
        nextTickets:[]
    });
    useEffect(()=>{
        const fetchActiveQueries = async()=>{
            try{
                const res = await axios.get("http://localhost:5555/ticket/queue/",{withCredentials:true});
                setLiveQueries(res.data);
                console.log(res.data);
            }catch(err){
                console.error(err);
            }
        }
        fetchActiveQueries();
    },[])
    const [todayAppointments, setTodayAppointments] = useState([]);
    useEffect(()=>{
        const fetchTodayAppointments = async()=>{
            try{
                const res = await axios.get("http://localhost:5555/appointment/worker",{withCredentials:true});
                setTodayAppointments(res.data.appointments);
            }catch(err){
                console.error(err);
            }
        }
        fetchTodayAppointments();
    },[])
        // const todayAppointments = [
        //     {
        //         id: 1,
        //         customerName: "test amaan",
        //         time: "11:00 AM",
        //         type: "Video Call",
        //         status: "Scheduled",
        //     },
        //     {
        //         id: 2,
        //         customerName: "test keshav",
        //         time: "2:30 PM",
        //         type: "Instant Query",
        //         status: "Pending",
        //     },
        // ];

        return (
            <div className="min-h-screen bg-blue-50">
                <nav
                    className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "glass-effect shadow-lg" : "bg-blue-50"
                        }`}
                >
                    <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                        <div className="transform hover:scale-105 transition-transform">
                            <span className="text-2xl sm:text-3xl font-bold text-gradient">
                                UBI भरोसा
                            </span>
                        </div>
                        <div className="hidden lg:flex items-center space-x-8">
                            <Link
                                to="/employee/dashboard"
                                className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                to="/employee/live-queries"
                                className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg font-medium"
                            >
                                Live Queries
                            </Link>
                            <Link
                                to="/employee/appointments"
                                className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg font-medium"
                            >
                                Appointments
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>

                <main className="pt-32 pb-20 px-6">
                    <div className="container mx-auto">
                        <div className="mb-16">
                            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-8 leading-tight">
                                Welcome back, {employeeName}!
                            </h1>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="bg-white p-6 rounded-2xl shadow-lg">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="bg-blue-100 p-3 rounded-xl">
                                            <Users className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-blue-900">
                                            Active Users
                                        </h3>
                                    </div>
                                    <p className="text-3xl font-bold text-blue-600">{workerData.activeUsersCount}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="bg-green-100 p-3 rounded-xl">
                                            <Clock className="h-6 w-6 text-green-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-blue-900">
                                            Pending Queries
                                        </h3>
                                    </div>
                                    <p className="text-3xl font-bold text-green-600">{workerData.pendingQueriesCount}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="bg-purple-100 p-3 rounded-xl">
                                            <Calendar className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-blue-900">
                                            Today's Appointments
                                        </h3>
                                    </div>
                                    <p className="text-3xl font-bold text-purple-600"> {workerData.pendingAppointmentsCount}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-semibold text-blue-900">
                                        Live Queries
                                    </h2>
                                    <Link
                                        to="/employee/live-queries"
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        View All
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {/* {liveQueries.nextQueries.map((query) => (
                                        <div
                                            key={query.id}
                                            className="p-4 border-2 border-gray-100 rounded-xl hover:border-blue-200 transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-gray-900">
                                                    {query.customerName}
                                                </span>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm ${query.priority === "High"
                                                            ? "bg-red-100 text-red-600"
                                                            : query.priority === "Medium"
                                                                ? "bg-yellow-100 text-yellow-600"
                                                                : "bg-green-100 text-green-600"
                                                        }`}
                                                >
                                                    {query.priority}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <span>{query.type}</span>
                                                <span>{query.time}</span>
                                            </div>
                                        </div>
                                    ))} */}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-semibold text-blue-900">
                                        Today's Appointments
                                    </h2>
                                    <Link
                                        to="/employee/appointments"
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        View All
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {todayAppointments.map((appointment) => (
                                        <div
                                            key={appointment.appointmentID}
                                            className="p-4 border-2 border-gray-100 rounded-xl hover:border-blue-200 transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-gray-00">
                                                    Customer ID: {appointment.customerID}
                                                </span>
                                                <div className="flex items-center">

                                                        <Video className="h-4 w-4 text-blue-600 mr-2" />

                                                    <span className="text-sm text-gray-600">
                                                        Video
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <span>{appointment.timeSlot}</span>
                                                <span
                                                    className={`flex items-center ${appointment.status === "scheduled"
                                                            ? "text-green-600"
                                                            : "text-yellow-600"
                                                        }`}
                                                >
                                                    {appointment.status === "scheduled" ? (
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                    ) : (
                                                        <AlertCircle className="h-4 w-4 mr-1" />
                                                    )}
                                                    {appointment.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    export default EmployeeDashboard;
