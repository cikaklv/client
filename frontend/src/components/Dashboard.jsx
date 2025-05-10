import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
    const [lowStockItems, setLowStockItems] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [lowStockResponse, totalValueResponse] = await Promise.all([
                    api.get('/products/low-stock'),
                    api.get('/inventory/total-value')
                ]);

                setLowStockItems(lowStockResponse.data);
                setTotalValue(totalValueResponse.data.totalValue);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleUpdateStock = (productId) => {
        // Navigate to stock movements with the product pre-selected
        navigate('/stock-movements', { state: { selectedProductId: productId } });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Total Inventory Value</h2>
                    <p className="text-3xl font-bold text-blue-600">
                        ${totalValue.toLocaleString()}
                    </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Low Stock Items</h2>
                    <p className="text-3xl font-bold text-red-600">
                        {lowStockItems.length}
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Low Stock Items</h2>
                    <Link to="/products" className="text-blue-600 hover:text-blue-800">
                        View All Products
                    </Link>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-3 text-left">Product</th>
                                <th className="px-6 py-3 text-left">Category</th>
                                <th className="px-6 py-3 text-left">Current Stock</th>
                                <th className="px-6 py-3 text-left">Minimum Stock</th>
                                <th className="px-6 py-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStockItems.map((item) => (
                                <tr key={item.productId} className="border-b">
                                    <td className="px-6 py-4">{item.name}</td>
                                    <td className="px-6 py-4">{item.category?.name}</td>
                                    <td className="px-6 py-4">{item.inventory?.quantity} {item.stockUnit}</td>
                                    <td className="px-6 py-4">{item.minimumStock} {item.stockUnit}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleUpdateStock(item.productId)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Update Stock
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 