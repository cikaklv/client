import express from 'express';
import db from '../models/index.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();
const Product = db.products;
const Category = db.categories;
const Inventory = db.inventory;

// Get all products with their categories and inventory
router.get('/', verifyToken, async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                { model: Category },
                { 
                    model: Inventory,
                    attributes: ['quantity']
                }
            ]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create product
router.post('/', verifyToken, async (req, res) => {
    try {
        const {
            name,
            stockUnit,
            description,
            categoryId,
            price,
            minimumStock,
            imageUrl
        } = req.body;

        const product = await Product.create({
            name,
            stockUnit,
            description,
            categoryId,
            price,
            minimumStock,
            imageUrl
        });

        // Create initial inventory record
        await Inventory.create({
            productId: product.productId,
            quantity: 0
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update product
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            stockUnit,
            description,
            categoryId,
            price,
            minimumStock,
            imageUrl
        } = req.body;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.update({
            name,
            stockUnit,
            description,
            categoryId,
            price,
            minimumStock,
            imageUrl
        });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete product
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Use a transaction to ensure data consistency
        await db.sequelize.transaction(async (t) => {
            // Find the product
            const product = await Product.findByPk(id, { transaction: t });
            if (!product) {
                throw new Error('Product not found');
            }

            // Delete associated inventory records
            await Inventory.destroy({
                where: { productId: id },
                transaction: t
            });

            // Delete associated stock movements
            await db.stockMovements.destroy({
                where: { productId: id },
                transaction: t
            });

            // Delete the product
            await product.destroy({ transaction: t });
        });

        res.json({ message: 'Product and associated records deleted successfully' });
    } catch (error) {
        if (error.message === 'Product not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
});

// Get low stock products
router.get('/low-stock', verifyToken, async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                { model: Category },
                { model: Inventory }
            ]
        });

        const lowStockProducts = products.filter(product => 
            product.inventory.quantity <= product.minimumStock
        );

        res.json(lowStockProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router; 