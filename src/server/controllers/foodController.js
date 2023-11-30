const foodController = {
    getNutritionInfo: async (req, res) => {
      const { barcode, grams } = req.body; // assuming servingSize is in grams

      try {
        // Fetch data from Open Food Facts API
        const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}`);
        const data = await response.json();
  
        // Check if product exists
        if (data.status !== 1) {
          return res.status(404).send('Product not found');
        }
  
        // Extract nutriments data
        const { nutriments } = data.product;
  
        // Calculate nutritional values based on serving size
        const factor = grams / 100;

        const nutrition = {
          calories: (nutriments['energy-kcal_100g'] * factor),
          protein: nutriments['proteins_100g'] * factor,
          carbs: nutriments['carbohydrates_100g'] * factor,
          fat: nutriments['fat_100g'] * factor,
        };
  
        // Send the calculated nutrition data
        res.json(nutrition);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the request');
      }
    }
  };
  
  module.exports = foodController;