import { ProductService } from '../../src/services/ProductService'; // Adjust the import path
import * as productRepo from '../../src/db/productRepo';
import fetch from 'node-fetch';

jest.mock('node-fetch', () => jest.fn());
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

      const product = await productService.retrieveProductFromAPI(mockBarcode);
      expect(fetch).toHaveBeenCalledWith(`https://world.openfoodfacts.org/api/v2/product/${mockBarcode}`);
      expect(product).toEqual({
        name: 'Test Product',
        calories_per_100g: 250,
        protein_per_100g: 10,
        carbohydrates_per_100g: 30,
        fat_per_100g: 5,
        barcode: mockBarcode
      });
    });
  });

  describe('retrieveProductByBarcode', () => {
    const mockBarcode = 'test-barcode';
    const mockProduct = {
      name: 'Test Product',
      calories_per_100g: 250,
      protein_per_100g: 10,
      carbohydrates_per_100g: 30,
      fat_per_100g: 5,
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
      name: 'New Product',
      calories_per_100g: 260,
      protein_per_100g: 11,
      carbohydrates_per_100g: 31,
      fat_per_100g: 6,
      barcode: 'new-barcode'
    };

    it('should save a new product to the database', async () => {
      jest.spyOn(productRepo, 'addProductToDb').mockResolvedValueOnce(1);

      const insertId = await productService.saveNewProduct(mockProduct);
      expect(productRepo.addProductToDb).toHaveBeenCalledWith(mockProduct);
      expect(insertId).toEqual(1);
    });
  });
});
