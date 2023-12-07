import express from 'express';
import { Request, Response } from 'express';
import productController from '../controllers/productController.js';

const router = express.Router();

router.get('/product/barcode/:barcode', async (req: Request, res: Response) => {
  await productController.getProductByBarcode(req, res);
});

router.get('/productEntries/:userId/:startDate/:endDate?', async (req: Request, res: Response) => {
  await productController.getProductEntries(req, res);
});

router.post('/productEntry', async (req: Request, res: Response) => {
  await productController.postProductEntry(req, res);
});

export default router;