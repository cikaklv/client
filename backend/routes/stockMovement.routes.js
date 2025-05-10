import express from 'express';
import db from '../models/index.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();
const StockMovement = db.stockMovements;
const Product = db.products;
const Inventory = db.inventory;

// Get all stock movements
router.get('/', verifyToken, async (req, res) => {
    try {
        const movements = await StockMovement.findAll({
            include: [
                { model: Product },
                { model: db.users, attributes: ['username'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(movements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create stock movement
router.post('/', verifyToken, async (req, res) => {
    try {
        const { productId, quantity, type, notes } = req.body;
        const userId = req.userId;

        // Validate required fields
        if (!productId || !quantity || !type) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                details: {
                    productId: !productId ? 'Product ID is required' : null,
                    quantity: !quantity ? 'Quantity is required' : null,
                    type: !type ? 'Type is required' : null
                }
            });
        }

        // Validate quantity is a positive number
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ 
                message: 'Invalid quantity',
                details: 'Quantity must be a positive number'
            });
        }

        // Validate type is either 'IN' or 'OUT'
        if (type !== 'IN' && type !== 'OUT') {
            return res.status(400).json({ 
                message: 'Invalid movement type',
                details: 'Type must be either IN or OUT'
            });
        }

        // Use a transaction to ensure data consistency
        const result = await db.sequelize.transaction(async (t) => {
            // Create stock movement
            const movement = await StockMovement.create({
                productId,
                quantity,
                type,
                notes,
                userId
            }, { transaction: t });

            // Update inventory
            const inventory = await Inventory.findOne({ 
                where: { productId },
                transaction: t 
            });

            if (!inventory) {
                throw new Error('Inventory not found');
            }

            const newQuantity = type === 'IN' 
                ? inventory.quantity + quantity 
                : inventory.quantity - quantity;

            // Only check for insufficient stock when removing stock
            if (type === 'OUT' && newQuantity < 0) {
                throw new Error('Insufficient stock');
            }

            await inventory.update({ quantity: newQuantity }, { transaction: t });

            return movement;
        });

        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating stock movement:', error);
        
        if (error.message === 'Inventory not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Insufficient stock') {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ 
            message: 'Failed to save stock movement',
            details: error.message
        });
    }
});

// Get stock movements by product
router.get('/product/:productId', verifyToken, async (req, res) => {
    try {
        const { productId } = req.params;
        const movements = await StockMovement.findAll({
            where: { productId },
            include: [
                { model: Product },
                { model: db.users, attributes: ['username'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(movements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete stock movement
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const movement = await StockMovement.findByPk(id);
        
        if (!movement) {
            return res.status(404).json({ message: 'Stock movement not found' });
        }

        // Get the inventory
        const inventory = await Inventory.findOne({ where: { productId: movement.productId } });
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        // Calculate new quantity based on movement type
        let newQuantity;
        if (movement.type === 'IN') {
            // If deleting an IN movement, subtract the quantity
            newQuantity = inventory.quantity - movement.quantity;
            // Only check for negative stock when deleting an IN movement
            if (newQuantity < 0) {
                return res.status(400).json({ message: 'Cannot delete this movement as it would result in negative stock' });
            }
        } else {
            // If deleting an OUT movement, add the quantity back
            newQuantity = inventory.quantity + movement.quantity;
        }

        // Update inventory and delete movement in a transaction
        await db.sequelize.transaction(async (t) => {
            await inventory.update({ quantity: newQuantity }, { transaction: t });
            await movement.destroy({ transaction: t });
        });

        res.json({ message: 'Stock movement deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update stock movement
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { productId, quantity, type, notes } = req.body;

        // Use a transaction to ensure data consistency
        const result = await db.sequelize.transaction(async (t) => {
            // Find the existing movement
            const oldMovement = await StockMovement.findByPk(id, { transaction: t });
            if (!oldMovement) {
                throw new Error('Stock movement not found');
            }

            // Get the inventory
            const inventory = await Inventory.findOne({ 
                where: { productId: oldMovement.productId },
                transaction: t 
            });
            if (!inventory) {
                throw new Error('Inventory not found');
            }

            // First, reverse the old movement's effect on inventory
            const oldQuantity = oldMovement.type === 'IN'
                ? inventory.quantity - oldMovement.quantity
                : inventory.quantity + oldMovement.quantity;

            // Then apply the new movement's effect
            const newQuantity = type === 'IN'
                ? oldQuantity + quantity
                : oldQuantity - quantity;

            if (newQuantity < 0) {
                throw new Error('Insufficient stock');
            }

            // Update inventory
            await inventory.update({ quantity: newQuantity }, { transaction: t });

            // Update the movement
            const updatedMovement = await oldMovement.update({
                productId,
                quantity,
                type,
                notes
            }, { transaction: t });

            return updatedMovement;
        });

        res.json(result);
    } catch (error) {
        if (error.message === 'Stock movement not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Insufficient stock') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
});

export default router; 