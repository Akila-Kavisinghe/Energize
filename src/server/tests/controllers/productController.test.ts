import { Mock } from "jest-mock";
import productController from "../../src/controllers/productController";
import { ProductService } from "../../src/services/ProductService";
import { Product } from "../../src/types/product";
import { Request, Response } from "express";

jest.mock("../../src/services/ProductService");

describe("Product Controller", () => {
  let req: Request;
  let res: Response;
  let mockProduct: Product;

  beforeEach(() => {
    // Reset mocks before each test
    jest.restoreAllMocks();

    // Create test data based on the Product interface
    mockProduct = {
      name: "Test Product",
      calories_per_100g: 250,
      protein_per_100g: 10,
      carbohydrates_per_100g: 30,
      fat_per_100g: 5,
      barcode: "test-barcode",
    };

    req = {
      body: { barcode: mockProduct.barcode },
      headers: {},
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  test("should retrieve a product from the database", async () => {
    // Spy on ProductService methods
    const retrieveProductByBarcodeSpy = jest
      .spyOn(ProductService.prototype, "retrieveProductByBarcode")
      .mockResolvedValue(mockProduct);

    // Call the getProduct method of the controller
    await productController.getProduct(req, res);

    // Check if the method was called with the correct barcode
    expect(retrieveProductByBarcodeSpy).toHaveBeenCalledWith(
      mockProduct.barcode
    );

    // Check if the response is correctly sent
    expect(res.json).toHaveBeenCalledWith(mockProduct);
    expect(res.json).toHaveBeenCalledTimes(1);
    const jsonResponse = (res.json as unknown as Mock).mock.calls[0][0];
    expect(jsonResponse).toEqual(
      expect.objectContaining({
        name: mockProduct.name,
        calories_per_100g: mockProduct.calories_per_100g,
        protein_per_100g: mockProduct.protein_per_100g,
        carbohydrates_per_100g: mockProduct.carbohydrates_per_100g,
        fat_per_100g: mockProduct.fat_per_100g,
        barcode: mockProduct.barcode,
      })
    );
  });

  test("should fetch product details from API and save to DB when not found in DB", async () => {
    // Setup the request with the allowdatabasewrites header set to true
    req.headers["allowdatabasewrites"] = "true";

    // Mock product data returned by the API
    const mockApiProduct: Product = {
      name: "API Product",
      calories_per_100g: 260,
      protein_per_100g: 12,
      carbohydrates_per_100g: 32,
      fat_per_100g: 6,
      barcode: "api-barcode",
    };

    req.body.barcode = "api-barcode";

    // Setup the ProductService spies
    jest
      .spyOn(ProductService.prototype, "retrieveProductByBarcode")
      .mockResolvedValueOnce(null);
    jest
      .spyOn(ProductService.prototype, "retrieveProductFromAPI")
      .mockResolvedValueOnce(mockApiProduct);
    const saveNewProductSpy = jest
      .spyOn(ProductService.prototype, "saveNewProduct")
      .mockResolvedValueOnce("UUID");

    // Call the getProduct method of the controller
    await productController.getProduct(req, res);

    // Expect the controller to have tried retrieving the product from the database
    expect(
      ProductService.prototype.retrieveProductByBarcode
    ).toHaveBeenCalledWith("api-barcode");
    // Expect the controller to have fetched product details from the API
    expect(
      ProductService.prototype.retrieveProductFromAPI
    ).toHaveBeenCalledWith("api-barcode");
    // Expect the product to be saved in the database
    expect(saveNewProductSpy).toHaveBeenCalledWith(mockApiProduct);

    // Check if the response is correctly sent
    expect(res.json).toHaveBeenCalledWith(mockApiProduct);
  });

  test("should return 404 for a non-existent product", async () => {
    req.body.barcode = "non-existent-barcode";

    // Setup the ProductService spies to return null, simulating non-existent product
    jest
      .spyOn(ProductService.prototype, "retrieveProductByBarcode")
      .mockResolvedValueOnce(null);
    jest
      .spyOn(ProductService.prototype, "retrieveProductFromAPI")
      .mockResolvedValueOnce(null);

    await productController.getProduct(req, res);

    // Expect the controller to have tried retrieving the product from the database and then the API
    expect(
      ProductService.prototype.retrieveProductByBarcode
    ).toHaveBeenCalledWith("non-existent-barcode");
    expect(
      ProductService.prototype.retrieveProductFromAPI
    ).toHaveBeenCalledWith("non-existent-barcode");

    // Check if the response is a 404 not found
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("Product not found");
  });

  test("should return 500 for an internal server error", async () => {
    // Simulate an internal server error by rejecting the promise
    jest
      .spyOn(ProductService.prototype, "retrieveProductByBarcode")
      .mockRejectedValueOnce(new Error("Internal server error"));

    await productController.getProduct(req, res);

    // Check if the response is a 500 internal server error
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error processing the request");
  });
});
