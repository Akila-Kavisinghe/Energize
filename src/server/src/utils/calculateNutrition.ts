import { Food } from "../types/food";

export const calculateNutrition = (food: Food, grams: number) => {
  const factor = grams / 100;

  return {
    calories: food.calories_per_100g * factor,
    protein: food.protein_per_100g * factor,
    carbs: food.carbohydrates_per_100g * factor,
    fat: food.fat_per_100g * factor,
  };
};
