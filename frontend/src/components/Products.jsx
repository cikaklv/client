import { useState, useEffect } from 'react';
import api from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        stockUnit: '',
        description: '',
        categoryId: '',
        price: '',
        minimumStock: '',
        imageUrl: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products');
            // Ensure price is a number
            const formattedProducts = response.data.map(product => ({
                ...product,
                price: parseFloat(product.price) || 0,
                minimumStock: parseInt(product.minimumStock) || 0
            }));
            setProducts(formattedProducts);
            setError('');
        } catch (error) {
            setError('Failed to fetch products');
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            const productData = {
                ...formData,
                price: parseFloat(formData.price) || 0,
                minimumStock: parseInt(formData.minimumStock) || 0
            };

            if (editingId) {
                await api.put(`/products/${editingId}`, productData);
            } else {
                await api.post('/products', productData);
            }

            setFormData({
                name: '',
                stockUnit: '',
                description: '',
                categoryId: '',
                price: '',
                minimumStock: '',
                imageUrl: ''
            });
            setEditingId(null);
            await fetchProducts();
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to save product');
            console.error('Error saving product:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name || '',
            stockUnit: product.stockUnit || '',
            description: product.description || '',
            categoryId: product.categoryId || '',
            price: (product.price || 0).toString(),
            minimumStock: (product.minimumStock || 0).toString(),
            imageUrl: product.imageUrl || ''
        });
        setEditingId(product.productId);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                setIsSubmitting(true);
                const response = await api.delete(`/products/${id}`);
                if (response.data.message) {
                    await fetchProducts();
                    setError('');
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to delete product';
                setError(errorMessage);
                console.error('Error deleting product:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (loading && products.length === 0) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Products</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Form Section */}
                <div className="lg:w-1/3">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingId ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-md border-2 border-gray-400 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full rounded-md border-2 border-gray-400 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.categoryId} value={category.categoryId}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Unit</label>
                                <input
                                    type="text"
                                    value={formData.stockUnit}
                                    onChange={(e) => setFormData({ ...formData, stockUnit: e.target.value })}
                                    className="w-full rounded-md border-2 border-gray-400 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full rounded-md border-2 border-gray-400 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock</label>
                                <input
                                    type="number"
                                    value={formData.minimumStock}
                                    onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
                                    className="w-full rounded-md border-2 border-gray-400 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-md border-2 border-gray-400 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
                                    rows="3"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full rounded-md border-2 border-gray-400 py-2 px-3 focus:border-blue-500 focus:ring-blue-500"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({
                                            name: '',
                                            stockUnit: '',
                                            description: '',
                                            categoryId: '',
                                            price: '',
                                            minimumStock: '',
                                            imageUrl: ''
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
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.productId}>
                                        <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {product.category?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            ${(product.price || 0).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {product.inventory?.quantity || 0} {product.stockUnit}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                                disabled={isSubmitting}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.productId)}
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

export default Products; 