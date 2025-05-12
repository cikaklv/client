import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

const StockMovements = () => {
    const [movements, setMovements] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingId, setEditingId] = useState(null);
    const location = useLocation();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [formData, setFormData] = useState({
        productId: '',
        type: 'IN',
        quantity: '',
        notes: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [movementsRes, productsRes] = await Promise.all([
                    api.get('/stock-movements'),
                    api.get('/products')
                ]);
                setMovements(movementsRes.data);
                setProducts(productsRes.data);

                // If there's a pre-selected product from the Dashboard
                if (location.state?.selectedProductId) {
                    setFormData(prev => ({
                        ...prev,
                        productId: location.state.selectedProductId
                    }));
                }
            } catch (error) {
                setError('Failed to fetch data');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            // Validate required fields
            if (!formData.productId || !formData.quantity || !formData.type) {
                setError('Please fill in all required fields');
                return;
            }

            // Validate quantity is a positive number
            const quantity = parseInt(formData.quantity);
            if (isNaN(quantity) || quantity <= 0) {
                setError('Quantity must be a positive number');
                return;
            }

            const movementData = {
                ...formData,
                quantity: quantity
            };

            if (editingId) {
                await api.put(`/stock-movements/${editingId}`, movementData);
                setSuccess('Stock movement updated successfully!');
            } else {
                await api.post('/stock-movements', movementData);
                setSuccess('Stock movement added successfully!');
            }

            // Reset form
            setFormData({
                productId: '',
                type: 'IN',
                quantity: '',
                notes: ''
            });
            setEditingId(null);

            // Refresh movements list
            const movementsRes = await api.get('/stock-movements');
            setMovements(movementsRes.data);
            
            setError('');
        } catch (error) {
            console.error('Error saving stock movement:', error);
            setError(error.response?.data?.message || 'Failed to save stock movement');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (movement) => {
        setFormData({
            productId: movement.productId,
            quantity: movement.quantity.toString(),
            type: movement.type,
            notes: movement.notes || ''
        });
        setEditingId(movement.movementId);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this stock movement?')) {
            try {
                setLoading(true);
                const response = await api.delete(`/stock-movements/${id}`);
                if (response.data.message) {
                    await fetchMovements();
                    setSuccess('Stock movement deleted successfully!');
                    setError('');
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to delete stock movement';
                setError(errorMessage);
                console.error('Error deleting stock movement:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const fetchMovements = async () => {
        try {
            setLoading(true);
            const response = await api.get('/stock-movements');
            setMovements(response.data);
            setError('');
        } catch (error) {
            setError('Failed to fetch stock movements');
            console.error('Error fetching stock movements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            setError('Please select both start and end dates.');
            return;
        }

        try {
            setLoading(true);
            const response = await api.get(`/stock-movements/report?startDate=${startDate}&endDate=${endDate}`);
            setMovements(response.data);
            setError('');
        } catch (error) {
            setError('Failed to generate report');
            console.error('Error generating report:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && movements.length === 0) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Stock Movements</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Form Section */}
                <div className="lg:w-1/3">
                    <form onSubmit={handleSubmit} className="p-6 ">
                        <h2 className="text-xl text-gray-800 font-semibold mb-4">
                            {editingId ? 'Edit Stock Movement' : 'Add New Stock Movement'}
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                                <select
                                    value={formData.productId}
                                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                    className="w-full rounded-md border-2 border-gray-400 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select a product</option>
                                    {products.map((product) => (
                                        <option key={product.productId} value={product.productId}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="w-full rounded-md border-2 border-gray-400 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    min="1"
                                    placeholder="Enter quantity"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full rounded-md border-2 border-gray-400 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="IN">Stock In</option>
                                    <option value="OUT">Stock Out</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <input
                                    type="text"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full rounded-md border-2 border-gray-400 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Enter notes"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : editingId ? 'Update Movement' : 'Add Movement'}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({
                                            productId: '',
                                            type: 'IN',
                                            quantity: '',
                                            notes: ''
                                        });
                                        setEditingId(null);
                                    }}
                                    className="w-full mt-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Table Section */}
                <div className="lg:w-2/3">
                    <div className="mb-6">
                        <h2 className="text-xl text-gray-800 font-semibold mb-4">Generate Report</h2>
                        <div className="flex space-x-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="rounded-md border-2 border-gray-400 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="rounded-md border-2 border-gray-400 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                onClick={handleGenerateReport}
                                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
                                disabled={loading}
                            >
                                Generate Report
                            </button>
                        </div>
                    </div>

                    <div className="">
                        <table className="min-w-full">
                            <thead className="bg-teal-600">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Notes
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {movements.map((movement) => (
                                    <tr key={movement.movementId}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(movement.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {movement.product?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                movement.type === 'IN' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {movement.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {movement.quantity}
                                        </td>
                                        <td className="px-6 py-4">
                                            {movement.notes}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {movement.user?.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(movement)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                                disabled={isSubmitting}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(movement.movementId)}
                                                className="text-red-600 hover:text-red-900"
                                                disabled={isSubmitting}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockMovements; 