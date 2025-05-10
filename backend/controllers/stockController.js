const { StockMovement, Inventory } = require('../models');

exports.addStock = async (req, res) => {
  const { productid, quantity, userid, notes } = req.body;
  const inventory = await Inventory.findOne({ where: { productid } });
  inventory.quantity += quantity;
  await inventory.save();

  await StockMovement.create({ productid, quantity, type: 'IN', notes, userid, createdAt: new Date() });
  res.sendStatus(200);
};

exports.removeStock = async (req, res) => {
  const { productid, quantity, userid, notes } = req.body;
  const inventory = await Inventory.findOne({ where: { productid } });
  if (inventory.quantity < quantity) return res.status(400).json({ error: 'Insufficient stock' });

  inventory.quantity -= quantity;
  await inventory.save();
  await StockMovement.create({ productid, quantity, type: 'OUT', notes, userid, createdAt: new Date() });
  res.sendStatus(200);
};