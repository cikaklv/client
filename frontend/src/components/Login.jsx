import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', formData);
            
            // Store the token in localStorage
            localStorage.setItem('token', response.data.token);
            
            // Store user data if needed
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Redirect to dashboard
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-800">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <a href="/signup" className="font-medium text-blue-600 hover:border-b-2 hover:border-blue-600">
                            create a new account
                        </a>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm">
                        <div className="mb-2">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full rounded-md border-2 border-gray-400 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Enter username..."
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full rounded-md border-2 border-gray-400 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Enter password..."
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                loading ? 'bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
                        >
                            {loading ? 'loging ing in...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;