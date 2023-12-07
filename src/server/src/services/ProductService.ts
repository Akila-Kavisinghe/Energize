import fetch from "node-fetch";
import * as productRepo from "../db/productRepo.js";
import { Product } from "../types/product.js";
import { ProductEntry } from "../types/productEntry.js";
import { v4 as uuidv4 } from "uuid";

export class ProductService {
  async retrieveProductFromAPI(barcode: string): Promise<Product | null> {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}`
    );
    if (!response.ok) return null;

    const data = await response.json();

    if (data.status !== 1 || !data.product) return null;

    const product = data.product;

    //Returns the product data as a Product object
    return {
      productId: uuidv4() + "-" + barcode,
      name: product.product_name,
      caloriesPer100g: product.nutriments["energy-kcal_100g"],
      proteinPer100g: product.nutriments.proteins_100g,
      carbohydratesPer100g: product.nutriments.carbohydrates_100g,
      fatPer100g: product.nutriments.fat_100g,
      barcode: barcode,
    };
  }

  async retrieveProductByBarcode(barcode: string): Promise<Product | null> {
    return productRepo.queryProductByBarcode(barcode);
  }

  async retrieveProductEntries(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<ProductEntry[]> {
    return productRepo.queryProductEntries(userId, startDate, endDate);
  }

  async saveProduct(product: Product): Promise<String | null> {
    return productRepo.addProductToDb(product);
  }

  async saveProductEntry(
    productEntry: ProductEntry
  ): Promise<ProductEntry> {
    productEntry.productEntryId = uuidv4();
    await productRepo.addProductEntryToDb(productEntry);
    return productEntry;
  }
}
