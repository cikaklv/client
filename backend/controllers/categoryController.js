const { category } =require('../models');


exports.getAll = async (req, res) => res.json(await category.findAll());
exports.create = async (req, res) => res.json(await category.create(req.body));
exports.update = async (req, res) =>{
    await category.update(req.body, { where: { categoryid: req.params.id }});
    res.sendStatus(200);
};
exports.delete = async (req, res) =>{
    await category.destroy({ where: { categoryid: req.params.id }});
    res.sendStatus(200);
};