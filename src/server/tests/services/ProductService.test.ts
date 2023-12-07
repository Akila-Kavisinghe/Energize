import { ProductService } from '../../src/services/ProductService'; // Adjust the import path
import * as productRepo from '../../src/db/productRepo';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

jest.mock('node-fetch', () => jest.fn());
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));
jest.mock('../../src/db/productRepo');

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
  });

  describe('retrieveProductFromAPI', () => {
    const mockBarcode = 'test-barcode';
    const mockApiResponse = {
      status: 1,
      product: {
        product_name: 'Test Product',
        nutriments: {
          "energy-kcal_100g": 250,
          proteins_100g: 10,
          carbohydrates_100g: 30,
          fat_100g: 5
        }
      }
    };

    it('should retrieve a product from the API', async () => {
      (fetch as unknown as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
      });

      (uuidv4 as unknown as jest.Mock).mockReturnValue("specific-uuid");

      const product = await productService.retrieveProductFromAPI(mockBarcode);
      expect(fetch).toHaveBeenCalledWith(`https://world.openfoodfacts.org/api/v2/product/${mockBarcode}`);
      expect(product).toEqual({
        name: 'Test Product',
        productId: "specific-uuid" + "-" + mockBarcode,
        caloriesPer100g: 250,
        proteinPer100g: 10,
        carbohydratesPer100g: 30,
        fatPer100g: 5,
        barcode: mockBarcode
      });
    });
  });

  describe('retrieveProductByBarcode', () => {
    const mockBarcode = 'test-barcode';
    const mockProduct = {
      productId: 'test-product-id',
      name: 'Test Product',
      caloriesPer100g: 250,
      proteinPer100g: 10,
      carbohydratesPer100g: 30,
      fatPer100g: 5,
      barcode: mockBarcode
    };

    it('should retrieve a product by barcode', async () => {
      jest.spyOn(productRepo, 'queryProductByBarcode').mockResolvedValueOnce(mockProduct);

      const product = await productService.retrieveProductByBarcode(mockBarcode);
      expect(productRepo.queryProductByBarcode).toHaveBeenCalledWith(mockBarcode);
      expect(product).toEqual(mockProduct);
    });
  });

  describe('saveNewProduct', () => {
    const mockProduct = {
      productId: 'test-product-id',
      name: 'New Product',
      caloriesPer100g: 260,
      proteinPer100g: 11,
      carbohydratesPer100g: 31,
      fatPer100g: 6,
      barcode: 'new-barcode'
    };

    it('should save a new product to the database', async () => {
      jest.spyOn(productRepo, 'addProductToDb').mockResolvedValueOnce("UUID");

      const insertId = await productService.saveProduct(mockProduct);
      expect(productRepo.addProductToDb).toHaveBeenCalledWith(mockProduct);
      expect(insertId).toEqual("UUID");
    });
  });
});
