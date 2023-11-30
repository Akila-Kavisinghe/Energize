const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

router.post('/nutrition-info', foodController.getNutritionInfo);

module.exports = router;