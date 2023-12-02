import foodController from "../../src/controllers/foodController";
import * as ProductServiceModule from "../../src/services/ProductService";
import { Food } from "../../src/types/food";
import { Request, Response } from "express";
import { ApiResponseSubset } from "../../src/types/apiResponseSubset";
import { calculateNutrition } from "../../src/utils/calculateNutrition";

describe("Food Controller", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: { barcode: "test-barcode", grams: 100 },
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.restoreAllMocks();
  });

  test("should return 404 for a non-existent product", async () => {
    const mockApiResponseSubset: ApiResponseSubset = {
      status: 0,
      product: {
        product_name: "Mock Product",
        nutriments: {
          "energy-kcal_100g": 100,
          proteins_100g: 10,
          carbohydrates_100g: 20,
          fat_100g: 5,
        },
      },
    };

    jest
      .spyOn(ProductServiceModule.ProductService.prototype, "getProductFromDb")
      .mockResolvedValueOnce(null);
    jest
      .spyOn(
        ProductServiceModule.ProductService.prototype,
        "fetchProductDetails"
      )
      .mockResolvedValueOnce(mockApiResponseSubset);

    await foodController.getNutritionInfo(req, res);

    expect(
      ProductServiceModule.ProductService.prototype.getProductFromDb
    ).toHaveBeenCalledWith("test-barcode");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("Product not found");
  });

  test("should return 500 for an internal server error", async () => {
    jest
      .spyOn(ProductServiceModule.ProductService.prototype, "getProductFromDb")
      .mockRejectedValueOnce(new Error("Internal server error"));

    await foodController.getNutritionInfo(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error processing the request");
  });

  test("should successfully retrieve and calculate nutrition info for an existing product", async () => {
    const mockFood = {
      name: "Mock Food Item",
      calories_per_100g: 250,
      protein_per_100g: 10,
      carbohydrates_per_100g: 30,
      fat_per_100g: 5,
      barcode: "test-barcode",
    };

    const requestDetails = {
      barcode: "test-barcode",
      grams: 200,
    };

    const expectedNutrition = {
      calories: mockFood.calories_per_100g * (requestDetails.grams / 100),
      protein: mockFood.protein_per_100g * (requestDetails.grams / 100),
      carbs: mockFood.carbohydrates_per_100g * (requestDetails.grams / 100),
      fat: mockFood.fat_per_100g * (requestDetails.grams / 100),
    };
    jest
      .spyOn(ProductServiceModule.ProductService.prototype, "getProductFromDb")
      .mockResolvedValueOnce(mockFood);

    // Update request body to use the test barcode and grams value
    req.body = requestDetails;

    await foodController.getNutritionInfo(req, res);

    expect(
      ProductServiceModule.ProductService.prototype.getProductFromDb
    ).toHaveBeenCalledWith(requestDetails.barcode);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: mockFood.name,
        calories: expectedNutrition.calories,
        protein: expectedNutrition.protein,
        carbs: expectedNutrition.carbs,
        fat: expectedNutrition.fat,
        date: expect.any(Date),
      })
    );
  });

  test.only("should fetch product details from external API when not found in DB", async () => {
    // What is returned by API
    const mockExternalProductDetails: ApiResponseSubset = {
      status: 1, // Assuming status 1 indicates success
      product: {
        product_name: "External Product",
        nutriments: {
          "energy-kcal_100g": 120,
          proteins_100g: 5,
          carbohydrates_100g: 15,
          fat_100g: 2,
        },
      },
    };

    // What is sent into request body
    const requestDetails = {
      barcode: "external-api-barcode",
      grams: 100,
    };

    // What is expected to be returned by the API
    const expectedNutrition = {
      calories:
        mockExternalProductDetails.product.nutriments["energy-kcal_100g"] *
        (requestDetails.grams / 100),
      protein:
        mockExternalProductDetails.product.nutriments.proteins_100g *
        (requestDetails.grams / 100),
      carbs:
        mockExternalProductDetails.product.nutriments.carbohydrates_100g *
        (requestDetails.grams / 100),
      fat:
        mockExternalProductDetails.product.nutriments.fat_100g *
        (requestDetails.grams / 100),
    };

    jest
      .spyOn(ProductServiceModule.ProductService.prototype, "getProductFromDb")
      .mockResolvedValueOnce(null);
    jest
      .spyOn(
        ProductServiceModule.ProductService.prototype,
        "fetchProductDetails"
      )
      .mockResolvedValueOnce(mockExternalProductDetails);
    jest
      .spyOn(
        ProductServiceModule.ProductService.prototype,
        "addProductToDatabase"
      )
      .mockResolvedValueOnce();

    const mockFood = {
      name: mockExternalProductDetails.product.product_name,
      calories_per_100g:
        mockExternalProductDetails.product.nutriments["energy-kcal_100g"],
      protein_per_100g:
        mockExternalProductDetails.product.nutriments.proteins_100g,
      carbohydrates_per_100g:
        mockExternalProductDetails.product.nutriments.carbohydrates_100g,
      fat_per_100g: mockExternalProductDetails.product.nutriments.fat_100g,
      barcode: requestDetails.barcode, // Assuming you need this for the transformation
    };

    const factor = requestDetails.grams / 100;
    const expectedCalculatedNutrition = {
      calories: mockFood.calories_per_100g * factor,
      protein: mockFood.protein_per_100g * factor,
      carbs: mockFood.carbohydrates_per_100g * factor,
      fat: mockFood.fat_per_100g * factor,
    };

    jest.mock('../../src/utils/calculateNutrition', () => ({
      calculateNutrition: jest.fn().mockReturnValue(expectedCalculatedNutrition)
    }));
    
    // Update request body to use the test barcode and grams value
    req.body = requestDetails;

    await foodController.getNutritionInfo(req, res);

    expect(
      ProductServiceModule.ProductService.prototype.getProductFromDb
    ).toHaveBeenCalledWith(requestDetails.barcode);
    expect(
      ProductServiceModule.ProductService.prototype.fetchProductDetails
    ).toHaveBeenCalledWith(requestDetails.barcode);

    // Check that the product details were added to the database
    expect(
      ProductServiceModule.ProductService.prototype.addProductToDatabase
    ).toHaveBeenCalledWith(mockExternalProductDetails, requestDetails.barcode);

    // check res.json
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: mockFood.name,
        calories: expectedCalculatedNutrition.calories,
        protein: expectedCalculatedNutrition.protein,
        carbs: expectedCalculatedNutrition.carbs,
        fat: expectedCalculatedNutrition.fat,
        date: expect.any(Date),
      })
    );
  });
});
