import express from 'express';
import db from '../models/index.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();
const Inventory = db.inventory;
const Product = db.products;

// Get all inventory items with product details
router.get('/', verifyToken, async (req, res) => {
    try {
        const inventory = await Inventory.findAll({
            include: [{ model: Product }]
        });
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get inventory by product ID
router.get('/product/:productId', verifyToken, async (req, res) => {
    try {
        const { productId } = req.params;
        const inventory = await Inventory.findOne({
            where: { productId },
            include: [{ model: Product }]
        });

        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update inventory quantity
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const inventory = await Inventory.findByPk(id);
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        await inventory.update({ quantity });
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get total inventory value
router.get('/total-value', verifyToken, async (req, res) => {
    try {
        const inventory = await Inventory.findAll({
            include: [{ model: Product }]
        });

        const totalValue = inventory.reduce((sum, item) => {
            return sum + (item.quantity * item.product.price);
        }, 0);

        res.json({ totalValue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router; 