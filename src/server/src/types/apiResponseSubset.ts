export interface ApiResponseSubset {
    status: number;
    product: {
      product_name: string;
      nutriments: {
        "energy-kcal_100g": number;
        proteins_100g: number;
        carbohydrates_100g: number;
        fat_100g: number;
      };
    };
}