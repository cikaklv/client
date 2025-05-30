import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 w-full bg-teal-600 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-white font-bold text-2xl">TECTONA FURNITURE</span>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link
                                    to="/dashboard"
                                    className="text-white px-3 py-2 text-sm font-medium hover:border-b-2 hover:border-white"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/products"
                                    className="text-white px-3 py-2 text-sm font-medium hover:border-b-2 hover:border-white"
                                >
                                    Products
                                </Link>
                                <Link
                                    to="/categories"
                                    className="text-white px-3 py-2 text-sm font-medium hover:border-b-2 hover:border-white"
                                >
                                    Categories
                                </Link>
                                <Link
                                    to="/stock-movements"
                                    className="text-white px-3 py-2 text-sm font-medium hover:border-b-2 hover:border-white"
                                >
                                    Stock Movements
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <span className="text-white font-bold mr-4">
                                Welcome, {user.username}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;