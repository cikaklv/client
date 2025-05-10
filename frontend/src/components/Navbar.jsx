import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-md z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex items-center">
                            <span className="text-xl font-bold text-gray-800">Tectona Furniture</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                        <Link to="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
                        <Link to="/categories" className="text-gray-600 hover:text-gray-900">Categories</Link>
                        <Link to="/stock-movements" className="text-gray-600 hover:text-gray-900">Stock Movements</Link>
                        <button
                            onClick={handleLogout}
                            className="text-gray-600 hover:text-gray-900"
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