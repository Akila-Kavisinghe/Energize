import { Request, Response } from "express";
import { calculateNutrition } from "../utils/calculateNutrition.js";
import { ProductService } from "../services/ProductService.js";

const productService = new ProductService();

const foodController = {
  getNutritionInfo: async (req: Request, res: Response) => {
    const { barcode, grams } = req.body;

    try {
      let food = await productService.getProductFromDb(barcode);

      if (!food) {
        const productDetails = await productService.fetchProductDetails(barcode);

        if (!productDetails || productDetails.status !== 1) {
          return res.status(404).send("Product not found");
        }

        // Add product info to the database if it's not already there
        await productService.addProductToDatabase(productDetails, barcode);
      }

      const nutrimentsCalculated = food
        ? calculateNutrition(food, grams)
        : null;

      // Send the calculated nutrition data
      res.json({
        name: food?.name,
        date: new Date(),
        ...nutrimentsCalculated,
      });
    } catch (error) {
      res.status(500).send("Error processing the request");
    }
  },
};

export default foodController;
