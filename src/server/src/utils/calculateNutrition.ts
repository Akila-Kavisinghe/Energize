import { Product } from "../types/product";

export const calculateNutrition = (product: Product, grams: number) => {
  const factor = grams / 100;

  return {
    calories: product.calories_per_100g * factor,
    protein: product.protein_per_100g * factor,
    carbs: product.carbohydrates_per_100g * factor,
    fat: product.fat_per_100g * factor,
  };
};
