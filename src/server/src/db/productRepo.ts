import pool from "./database.js"; // Import your database pool
import { Product } from "../types/product.js";
import { v4 as uuidv4 } from 'uuid';

async function queryProductByBarcode(barcode: string): Promise<Product | null> {
  return new Promise((resolve, reject) => {
    try {
      const query =
        "SELECT name, calories_per_100g, protein_per_100g, carbohydrates_per_100g, fat_per_100g, barcode FROM products WHERE barcode = ?";
      pool.query(query, [barcode], (err, results: any) => {
        if (results.length > 0) {
          const product: Product = results[0];
          resolve({
            name: product.name,
            calories_per_100g: product.calories_per_100g,
            protein_per_100g: product.protein_per_100g,
            carbohydrates_per_100g: product.carbohydrates_per_100g,
            fat_per_100g: product.fat_per_100g,
            barcode,
          });
        } else {
          resolve(null);
        }
      });
    } catch (error) {
      console.error(`Error in productRepo: queryProductByBarcode: ${error}`);
      throw new Error(`Failed to query product by barcode: ${barcode}`);
    }
  });
}

async function addProductToDb(product: Product): Promise<String> {
  return new Promise((resolve, reject) => {
    try {
      const productId = uuidv4()
      const query = `INSERT INTO products (product_id, name, protein_per_100g, carbohydrates_per_100g, fat_per_100g, calories_per_100g, barcode) VALUES (?, ?, ?, ?, ?, ?)`;

      const values = [
        productId,
        product.name,
        product.protein_per_100g,
        product.carbohydrates_per_100g,
        product.fat_per_100g,
        product.calories_per_100g,
        product.barcode,
      ];

      pool.query(query, values, (err, results: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(productId); // Resolves with the UUID of the inserted product
        }
      });
    } catch (error) {
      console.error(`Error in productRepo: addProductToDb: ${error}`);
      throw new Error(`Failed to add product: ${product.name}`);
    }
  });
}

export { queryProductByBarcode, addProductToDb };
