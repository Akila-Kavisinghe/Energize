import fetch from "node-fetch";
import * as foodModel from "../db/foodModel.js";
import { ApiResponseSubset } from "../types/apiResponseSubset.js"; // Assuming this type is defined

export class ProductService {
  async fetchProductDetails(barcode: string): Promise<ApiResponseSubset | null> {
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}`);
    if (!response.ok) return null;
    return await response.json() as ApiResponseSubset;
  }

  async getProductFromDb(barcode: string) {
    return foodModel.getProductFromDb(barcode);
  }

  async addProductToDatabase(productData: ApiResponseSubset, barcode: string) {
    // Logic to add product info to the database
    await foodModel.addProductToDb({
        name: productData.product.product_name,
        calories_per_100g: productData.product.nutriments["energy-kcal_100g"],
        protein_per_100g: productData.product.nutriments["proteins_100g"],
        carbohydrates_per_100g: productData.product.nutriments["carbohydrates_100g"],
        fat_per_100g: productData.product.nutriments["fat_100g"],
        barcode,
    });
  }
}