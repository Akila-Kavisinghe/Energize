import express from 'express';
import { Request, Response } from 'express';
import foodController from '../controllers/foodController.js';

const router = express.Router();

router.post('/nutrition-info', async (req: Request, res: Response) => {
  await foodController.getNutritionInfo(req, res);
});

export default router;