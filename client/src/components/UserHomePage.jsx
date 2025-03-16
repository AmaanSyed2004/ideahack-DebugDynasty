import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CreditCard, Car, Home } from "lucide-react";

function UserHomePage() {
    // For now the username is hard-coded. Later, get it from your auth context
    const username = "userrrrrr";

    // Set up scroll detection so that the navbar changes style when scrolling
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Dummy logout function – this is where you would call your backend logout API
    const handleLogout = () => {
        // Example of what you might do:
        // await fetch('/api/logout', { method: 'POST' });
        // Clear authentication tokens, then navigate to the login page.
        console.log("Logout function invoked (dummy implementation).");
        // For now, no actual routing takes place:
        // navigate("/login");
    };

    return (
        <div className="min-h-screen bg-blue-50">
            {/* User-Specific Navbar */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "glass-effect shadow-lg" : "bg-blue-50"}`}>
                <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="transform hover:scale-105 transition-transform">
                        <span className="text-2xl sm:text-3xl font-bold text-gradient">
                            UBI भरोसा
                        </span>
                    </div>
                    {/* Desktop Navigation Buttons */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <Link
                            to="/dashboard"
                            className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
                        >
                            Home
                        </Link>
                        <Link
                            to="/my-queries"
                            className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
                        >
                            My Queries
                        </Link>
                        <Link
                            to="/my-appointments"
                            className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
                        >
                            My Appointments
                        </Link>
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="nav-link text-blue-900 hover:text-red-600 transition-colors text-lg"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            code

            <main className="pt-32 pb-20 px-6">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-8 leading-tight">
                        Hello, {username}!
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-12">
                        What would you like to do today?
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/raise-query"
                            className="group flex items-center px-6 md:px-8 py-3 md:py-4 text-white bg-gradient-to-r from-blue-600 to-red-600 rounded-full hover:shadow-2xl transition-all hover:scale-105 transform"
                        >
                            Raise a Query
                        </Link>
                        <Link
                            to="/my-queries"
                            className="group flex items-center px-6 md:px-8 py-3 md:py-4 text-white bg-gradient-to-r from-blue-600 to-red-600 rounded-full hover:shadow-2xl transition-all hover:scale-105 transform"
                        >
                            View Active Queries
                        </Link>
                        <Link
                            to="/my-appointments"
                            className="group flex items-center px-6 md:px-8 py-3 md:py-4 text-white bg-gradient-to-r from-blue-600 to-red-600 rounded-full hover:shadow-2xl transition-all hover:scale-105 transform"
                        >
                            View Upcoming Appointments
                        </Link>
                        <Link
                            to="/feedback"
                            className="group flex items-center px-6 md:px-8 py-3 md:py-4 text-white bg-gradient-to-r from-blue-600 to-red-600 rounded-full hover:shadow-2xl transition-all hover:scale-105 transform"
                        >
                            Give Feedback
                        </Link>
                    </div>
                </div>

                <section className="mt-20">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-gradient mb-16">
                            Personalized Recommendations
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Credit Loans Card */}
                            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
                                <div className="bg-blue-50 p-4 rounded-2xl inline-block mb-6">
                                    <CreditCard className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-4">
                                    Credit Loans
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Explore flexible credit options tailored for you.
                                </p>
                            </div>
                            {/* Car Loans Card */}
                            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
                                <div className="bg-blue-50 p-4 rounded-2xl inline-block mb-6">
                                    <Car className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-4">
                                    Car Loans
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Get your dream car with our competitive loan offers.
                                </p>
                            </div>
                            {/* Home Loans Card */}
                            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
                                <div className="bg-blue-50 p-4 rounded-2xl inline-block mb-6">
                                    <Home className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-4">
                                    Home Loans
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Discover the best rates to finance your new home.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default UserHomePage;
