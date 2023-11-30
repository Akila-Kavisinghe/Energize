const foodModel = require("../db/foodModel");

const foodController = {
  getNutritionInfo: async (req, res) => {
    const { barcode, grams } = req.body;

    try {
      let productInfo = await foodModel.getProductFromDb(barcode);

      if (!productInfo) {
        const response = await fetch(
          `https://world.openfoodfacts.org/api/v2/product/${barcode}`
        );
        const data = await response.json();

        if (data.status !== 1) {
          return res.status(404).send("Product not found");
        }

        const { nutriments, product_name } = data.product;

        productInfo = {
          product_name,
          nutriments: {
            calories_per_100g: nutriments["energy-kcal_100g"],
            protein_per_100g: nutriments["proteins_100g"],
            carbohydrates_per_100g: nutriments["carbohydrates_100g"],
            fat_per_100g: nutriments["fat_100g"],
          },
        };

        // Add product info to the database if it's not already there
        await foodModel.addProductToDb({
          ...productInfo,
          barcode
        });
      }

      const nutrimentsCalculated = calculateNutrition(productInfo, grams);

      // Send the calculated nutrition data
      res.json({
        product_name: productInfo.product_name,
        nutriments: nutrimentsCalculated,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing the request");
    }
  },
};

const calculateNutrition = (productInfo, grams) => {
  const factor = grams / 100;

  return {
    calories: productInfo.nutriments.calories_per_100g * factor,
    protein: productInfo.nutriments.protein_per_100g * factor,
    carbs: productInfo.nutriments.carbohydrates_per_100g * factor,
    fat: productInfo.nutriments.fat_per_100g * factor,
  };
};

module.exports = foodController;
