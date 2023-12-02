import { calculateNutrition } from "../../src/utils/calculateNutrition";
import { Food } from "../../src/types/food";

describe("calculateNutrition", () => {
  it("should correctly calculate nutrition based on grams", () => {
    const food: Food = {
      name: "Some food",
      calories_per_100g: 200,
      protein_per_100g: 10,
      carbohydrates_per_100g: 20,
      fat_per_100g: 5,
      barcode: "somebarcode",
    };

    const grams = 250; // Testing with 250 grams
    const result = calculateNutrition(food, grams);

    expect(result).toEqual({
      calories: 500, // 200 * 2.5
      protein: 25, // 10 * 2.5
      carbs: 50, // 20 * 2.5
      fat: 12.5, // 5 * 2.5
    });
  });
});
