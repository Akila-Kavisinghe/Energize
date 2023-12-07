import { Product } from "../types/product";

export const calculateNutrition = (product: Product, grams: number) => {
  const factor = grams / 100;

  return {
    calories: product.caloriesPer100g * factor,
    protein: product.proteinPer100g * factor,
    carbohydrates: product.carbohydratesPer100g * factor,
    fat: product.fatPer100g * factor,
  };
};
