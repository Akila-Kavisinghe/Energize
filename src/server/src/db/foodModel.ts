import pool from "./database.js"; // Import your database pool
import { Food } from "../types/food.js"

async function getProductFromDb(barcode: string): Promise<Food | null> {
  return new Promise((resolve, reject) => {
    const query = "SELECT name, calories_per_100g, protein_per_100g, carbohydrates_per_100g, fat_per_100g, barcode FROM foods WHERE barcode = ?";
    pool.query(query, [barcode], (err, results: any) => {
      if (err) {
        reject(err);
        return;
      }

      if (results.length > 0) {
        const food: Food = results[0];
        resolve({
          name: food.name,
          calories_per_100g: food.calories_per_100g,
          protein_per_100g: food.protein_per_100g,
          carbohydrates_per_100g: food.carbohydrates_per_100g,
          fat_per_100g: food.fat_per_100g,
          barcode,
        });
      } else {
        resolve(null);
      }
    });
  });
}

async function addProductToDb(food: Food): Promise<number> {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO foods (name, protein_per_100g, carbohydrates_per_100g, fat_per_100g, calories_per_100g, barcode) VALUES (?, ?, ?, ?, ?, ?)`;

    const values = [
      food.name,
      food.protein_per_100g,
      food.carbohydrates_per_100g,
      food.fat_per_100g,
      food.calories_per_100g,
      food.barcode,
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

export { getProductFromDb, addProductToDb };
