const {Inventory, Product} = require('../models');


exports.getAll = async (req, res) => {
    const inventory = await Inventory.findAll({ include: Product });
    res.json(inventory);
};

