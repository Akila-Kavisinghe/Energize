import { calculateNutrition } from "../../src/utils/calculateNutrition";
import { Product } from "../../src/types/product";

describe("calculateNutrition", () => {
  it("should correctly calculate nutrition based on grams", () => {
    const product: Product = {
      productId: "someid",
      name: "Some product",
      caloriesPer100g: 200,
      proteinPer100g: 10,
      carbohydratesPer100g: 20,
      fatPer100g: 5,
      barcode: "somebarcode",
    };

    const grams = 250; // Testing with 250 grams
    const result = calculateNutrition(product, grams);

    expect(result).toEqual({
      calories: 500, // 200 * 2.5
      protein: 25, // 10 * 2.5
      carbohydrates: 50, // 20 * 2.5
      fat: 12.5, // 5 * 2.5
    });
  });
});
