import pool from "./database.js"; // Import your database pool

interface ProductInfo {
  product_name: string;
  nutriments: {
    calories_per_100g: number;
    protein_per_100g: number;
    carbohydrates_per_100g: number;
    fat_per_100g: number;
  };
  barcode: string;
}

async function getProductFromDb(barcode: string): Promise<ProductInfo | null> {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM foods WHERE barcode = ?";
    pool.query(query, [barcode], (err, results: any) => {
      if (err) {
        reject(err);
        return;
      }

      if (results.length > 0) {
        const product: any = results[0];
        resolve({
          product_name: product.product_name,
          nutriments: {
            calories_per_100g: product.calories_per_100g,
            protein_per_100g: product.protein_per_100g,
            carbohydrates_per_100g: product.carbohydrates_per_100g,
            fat_per_100g: product.fat_per_100g,
          },
          barcode,
        });
      } else {
        resolve(null);
      }
    });
  });
}

async function addProductToDb(productInfo: ProductInfo): Promise<number> {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO foods (product_name, protein_per_100g, carbohydrates_per_100g, fat_per_100g, calories_per_100g, barcode) VALUES (?, ?, ?, ?, ?, ?)`;

    const values = [
      productInfo.product_name,
      productInfo.nutriments.protein_per_100g,
      productInfo.nutriments.carbohydrates_per_100g,
      productInfo.nutriments.fat_per_100g,
      productInfo.nutriments.calories_per_100g,
      productInfo.barcode,
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
