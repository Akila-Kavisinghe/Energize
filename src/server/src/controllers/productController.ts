import { Request, Response } from "express";
import { ProductService } from "../services/ProductService.js";
import { ProductEntry } from "../types/productEntry.js";

const productService = new ProductService();

const productController = {
  getProductByBarcode: async (req: Request, res: Response) => {
    try {
      const barcode = req.params.barcode;
      const allowDatabaseWrites = req.headers["allowdatabasewrites"] === "true";

      // Retrieve the product from the database
      let product = await productService.retrieveProductByBarcode(barcode);

      // If not in the database, get it from the API
      if (!product) {
        product = await productService.retrieveProductFromAPI(barcode);

        if (!product) {
          return res.status(404).send("Product not found");
        }
        else if (allowDatabaseWrites) {
          await productService.saveProduct(product);
        }
      }

      res.json(product);
    } catch (error) {
      // console.error(`Error in productController: getProduct: ${error}`);
      res.status(500).send("Error processing the request");
    }
  },
  getProductEntries: async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const startDate = req.params.startDate;
      const endDate = req.params.endDate;
      const productEntries = await productService.retrieveProductEntries(
        userId,
        startDate,
        endDate
      );

      res.json(productEntries);
    } catch (error) {
      // console.error(`Error in productController: getProductEntries: ${error}`);
      res.status(500).send("Error processing the request");
    }
  },
  postProductEntry: async (req: Request, res: Response) => {
    try {
      const productEntry: ProductEntry = req.body.productEntry;

      productService.saveProductEntry(productEntry);

      res.json(productEntry.productId);
    } catch (error) {
      // console.error(`Error in productController: postProductEntry: ${error}`);
      res.status(500).send("Error processing the request");
    }
  },
};

export default productController;
