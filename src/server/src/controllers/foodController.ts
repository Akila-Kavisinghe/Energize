import fetch from "node-fetch";
import { Request, Response } from "express";
import * as foodModel from "../db/foodModel.js";
import { Food } from "../types/food";

interface ApiResponseSubset {
  status: number;
  product: {
    product_name: string;
    nutriments: {
      "energy-kcal_100g": number;
      proteins_100g: number;
      carbohydrates_100g: number;
      fat_100g: number;
    };
  };
}

const foodController = {
  getNutritionInfo: async (req: Request, res: Response) => {
    const { barcode, grams } = req.body;

    try {
      let food = await foodModel.getProductFromDb(barcode);

      if (!food) {
        const response = await fetch(
          `https://world.openfoodfacts.org/api/v2/product/${barcode}`
        );
        const data = (await response.json()) as ApiResponseSubset;

        if (data.status !== 1) {
          return res.status(404).send("Product not found");
        }

        // Add product info to the database if it's not already there
        await foodModel.addProductToDb({
          name: data.product.product_name,
          calories_per_100g: data.product.nutriments["energy-kcal_100g"],
          protein_per_100g: data.product.nutriments["proteins_100g"],
          carbohydrates_per_100g: data.product.nutriments["carbohydrates_100g"],
          fat_per_100g: data.product.nutriments["fat_100g"],
          barcode,
        });
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
      console.error(error);
      res.status(500).send("Error processing the request");
    }
  },
};

const calculateNutrition = (food: Food, grams: number) => {
  const factor = grams / 100;

  return {
    calories: food.calories_per_100g * factor,
    protein: food.protein_per_100g * factor,
    carbs: food.carbohydrates_per_100g * factor,
    fat: food.fat_per_100g * factor,
  };
};

export default foodController;
