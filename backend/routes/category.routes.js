import express from 'express';
import db from '../models/index.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();
const Category = db.categories;

// Get all categories
router.get('/', verifyToken, async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create category
router.post('/', verifyToken, async (req, res) => {
    try {
        const { name, stockUnit, description } = req.body;
        const category = await Category.create({
            name,
            stockUnit,
            description
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update category
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, stockUnit, description } = req.body;
        
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.update({
            name,
            stockUnit,
            description
        });

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete category
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await category.destroy();
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router; 