import express from 'express';
import { Request, Response } from 'express';
import foodController from '../controllers/productController.js';

const router = express.Router();

router.post('/getProduct', async (req: Request, res: Response) => {
  await foodController.getProduct(req, res);
});

export default router;