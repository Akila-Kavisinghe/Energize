import fetch from "node-fetch";
import * as foodModel from "../db/foodModel.js";
import { Food } from "../types/food.js";

export class ProductService {
  async retrieveProductFromAPI(barcode: string): Promise<Food | null> {
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}`);
    if (!response.ok) return null;

    const data = await response.json();
    
    if (data.status !== 1 || !data.product) return null;

    const product = data.product;

    //Returns the product data as a Food object
    return {
        name: product.product_name,
        calories_per_100g: product.nutriments["energy-kcal_100g"],
        protein_per_100g: product.nutriments.proteins_100g,
        carbohydrates_per_100g: product.nutriments.carbohydrates_100g,
        fat_per_100g: product.nutriments.fat_100g,
        barcode: barcode
    };
}

  async retrieveProductByBarcode(barcode: string) : Promise<Food | null> {
    return foodModel.queryProductByBarcode(barcode);
  }

  async saveNewProduct(food: Food) : Promise<number | null> {
    return foodModel.addProductToDb(food);
  }
}