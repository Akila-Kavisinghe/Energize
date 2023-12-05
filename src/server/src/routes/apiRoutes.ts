import express from 'express';
import { Request, Response } from 'express';
import productController from '../controllers/productController.js';

const router = express.Router();

router.post('/getProduct', async (req: Request, res: Response) => {
  await productController.getProduct(req, res);
});

export default router;