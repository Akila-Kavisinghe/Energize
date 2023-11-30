const pool = require("./database"); // Import your database pool

async function getProductFromDb(barcode) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM foods WHERE barcode = ?";
    pool.query(query, [barcode], (err, results) => {
      if (err) {
        reject(err);
        return;
      }

      if (results.length > 0) {
        const product = results[0];
        resolve({
          product_name: product.product_name,
          nutriments: {
            calories_per_100g: product.calories_per_100g,
            protein_per_100g: product.protein_per_100g,
            carbohydrates_per_100g: product.carbohydrates_per_100g,
            fat_per_100g: product.fat_per_100g,
          }
        });
      } else {
        resolve(null);
      }
    });
  });
}

async function addProductToDb(productInfo) {
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

    pool.query(query, values, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results.insertId); // Resolves with the ID of the inserted product
    });
  });
}
module.exports = {
  getProductFromDb,
  addProductToDb,
};
