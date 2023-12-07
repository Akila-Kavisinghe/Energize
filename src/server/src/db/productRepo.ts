import pool from "./database.js"; // Import your database pool
import { Product } from "../types/product.js";
import { ProductEntry } from "../types/productEntry.js";

async function queryProductByBarcode(barcode: string): Promise<Product | null> {
  return new Promise((resolve, reject) => {
    try {
      const query =
        "SELECT product_id, name, calories_per_100g, protein_per_100g, carbohydrates_per_100g, fat_per_100g, barcode FROM products WHERE barcode = ?";
      pool.query(query, [barcode], (err, results: any) => {
        if (results.length > 0) {
          const product: Product = results[0];
          resolve({
            productId: product.productId,
            name: product.name,
            calories_per_100g: product.calories_per_100g,
            protein_per_100g: product.protein_per_100g,
            carbohydrates_per_100g: product.carbohydrates_per_100g,
            fat_per_100g: product.fat_per_100g,
            barcode
          });
        } else {
          resolve(null);
        }
      });
    } catch (error) {
      // console.error(`Error in productRepo: queryProductByBarcode: ${error}`);
      throw new Error(`Failed to query product by barcode: ${barcode}`);
    }
  });
}

async function addProductToDb(product: Product): Promise<String> {
  return new Promise((resolve, reject) => {
    try {
      const query = `INSERT INTO products (product_id, name, protein_per_100g, carbohydrates_per_100g, fat_per_100g, calories_per_100g, barcode) VALUES (?, ?, ?, ?, ?, ?)`;

      const values = [
        product.productId,
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
          resolve(product.productId); // Resolves with the UUID of the inserted product
        }
      });
    } catch (error) {
      // console.error(`Error in productRepo: addProductToDb: ${error}`);
      throw new Error(`Failed to add product: ${product.name}`);
    }
  });
}

async function queryProductEntries(
  userId: string,
  startDate: string,
  endDate: string
): Promise<ProductEntry[]> {
  return new Promise((resolve, reject) => {
    try {
      const query =
        "SELECT product_entry_id, user_id, date_consumed, product_id, name, grams, calories, protein, carbs, fat FROM product_entries WHERE user_id = ? AND date_consumed >= ? AND date_consumed <= ?";
      pool.query(
        query,
        [userId, startDate, endDate],
        (err, results: any) => {
          if (err) {
            reject(err);
          } else {
            const productEntries: ProductEntry[] = results.map(
              (result: any) => {
                return {
                  productEntryId: result.product_entry_id,
                  userId: result.user_id,
                  dateConsumed: result.date_consumed,
                  productId: result.product_id,
                  name: result.name,
                  grams: result.grams,
                  calories: result.calories,
                  protein: result.protein,
                  carbohydrates: result.carbs,
                  fat: result.fat,
                };
              }
            );
            resolve(productEntries);
          }
        }
      );
    } catch (error) {
      // console.error(`Error in productRepo: queryProductEntries: ${error}`);
      throw new Error(`Failed to query product entries`);
    }
  });
}

async function addProductEntryToDb(productEntry: ProductEntry): Promise<String> {
  return new Promise((resolve, reject) => {
    try {
      const query = `INSERT INTO product_entries (product_entry_id, user_id date_consumed, product_id, name, grams, calories, protein, carbs, fat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        productEntry.productEntryId,
        productEntry.userId,
        productEntry.dateConsumed,
        productEntry.productId,
        productEntry.name,
        productEntry.grams,
        productEntry.calories,
        productEntry.protein,
        productEntry.carbohydrates,
        productEntry.fat
      ];

      pool.query(query, values, (err, results: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(productEntry.productEntryId); // Resolves with the UUID of the inserted product
        }
      });
    } catch (error) {
      // console.error(`Error in productRepo: addProductEntryToDb: ${error}`);
      throw new Error(`Failed to add product: ${productEntry.name}`);
    }
  });
}

export { queryProductByBarcode, addProductToDb, queryProductEntries, addProductEntryToDb };
