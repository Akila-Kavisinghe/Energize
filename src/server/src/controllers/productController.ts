import { Request, Response } from "express";
import { ProductService } from "../services/ProductService.js";

const productService = new ProductService();

const productController = {
  getProduct: async (req: Request, res: Response) => {
    try {
      const { barcode } = req.body;
      const allowDatabaseWrites = req.headers["allowdatabasewrites"] === "true";

      // Retrieve the product from the database
      let product = await productService.retrieveProductByBarcode(barcode);

      // If not in the database, get it from the API
      if (!product) {
        product = await productService.retrieveProductFromAPI(barcode);

        if (!product) {
          return res.status(404).send("Product not found");
        }

        // If the product is fetched from the API and database writes are allowed, add it to the database
        if (allowDatabaseWrites) {
          await productService.saveNewProduct(product);
        }
      }

      res.json(product);
    } catch (error) {
      console.error(`Error in productController: getProduct: ${error}`);
      res.status(500).send("Error processing the request");
    }
  },
};

export default productController;
