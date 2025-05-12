import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (onLogout) onLogout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-teal-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-2xl font-bold tracking-wide">TECTONA FURNITURE</Link>
                        <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                        <Link to="/products" className="hover:text-gray-300">Products</Link>
                        <Link to="/categories" className="hover:text-gray-300">Categories</Link>
                        <Link to="/stock-movements" className="hover:text-gray-300">Stock Movements</Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user && <span>Welcome, {user.username}</span>}
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 