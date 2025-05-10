const express = require('express');
const router = express.Router();
const controller = require('../controllers/stockController');

router.post('/add', controller.addStock);
router.post('/remove', controller.removeStock);

module.exports = router;