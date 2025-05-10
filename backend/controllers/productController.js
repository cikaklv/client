const {Product} = require('../models');


exports.getAll = async (req, res) => res.json(await Product.findAll());
exports.create = async (req, res) => res.json(await Product.create(req.body));
exports.update = async (req, res) => {
    await Product.update(req.body, {where: {productid: req.params.id}});
    res.sendStatus(200);
};
exports.delete = async (req, res) => {
    await Product.destroy({where: {productid: req.params.id}});
    res.sendStatus(200);
};