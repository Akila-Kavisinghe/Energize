import pool from "./database.js"; // Import your database pool
import { Product } from "../types/product.js"

async function queryProductByBarcode(barcode: string): Promise<Product | null> {
  return new Promise((resolve, reject) => {
    const query = "SELECT name, calories_per_100g, protein_per_100g, carbohydrates_per_100g, fat_per_100g, barcode FROM products WHERE barcode = ?";
    pool.query(query, [barcode], (err, results: any) => {
      if (err) {
        reject(err);
        return;
      }

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
  });
}

async function addProductToDb(product: Product): Promise<number> {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO products (name, protein_per_100g, carbohydrates_per_100g, fat_per_100g, calories_per_100g, barcode) VALUES (?, ?, ?, ?, ?, ?)`;

    const values = [
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
        return;
      }
      resolve(results.insertId); // Resolves with the ID of the inserted product
    });
  });
}

export { queryProductByBarcode, addProductToDb };
