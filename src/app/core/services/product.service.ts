import { Injectable } from '@angular/core';
import { Product, ProductResponse } from '../models/product.model';
import { Category } from '../models/category.model';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Brand } from '../models/brand.modal';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';
  private readonly PRODUCTS_CACHE_KEY = 'products_cache';
  private readonly CATEGORIES_CACHE_KEY = 'categories_cache';

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  getProducts(): Observable<Product[]> {
    return this.cacheService.fetchData<Product[]>(
      this.PRODUCTS_CACHE_KEY,
      () => {
        const params = new HttpParams().set('limit', '100');
        return this.http
          .get<ProductResponse>(`${this.apiUrl}/search`, { params })
          .pipe(map((response) => response.products));
      }
    );
  }

  getCategories(): Observable<Category[]> {
    return this.cacheService.fetchData<Category[]>(
      this.CATEGORIES_CACHE_KEY,
      () => this.http.get<Category[]>(`${this.apiUrl}/categories`)
    );
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  filterProducts(
    products: Product[],
    page: number,
    ratingFrom: number,
    ratingTo: number,
    brand: string[],
    priceFrom?: number,
    priceTo?: number,
    category?: string,
    keyword?: string
  ): { products: Product[]; total: number } {
    let filteredProducts = products.filter(
      (product) =>
        (!category || product.category === category) &&
        (!brand || brand.length === 0 || brand.includes(product.brand)) &&
        (!priceFrom || product.price >= priceFrom) &&
        (!priceTo || product.price <= priceTo) &&
        (!ratingFrom || product.rating >= ratingFrom) &&
        (!ratingTo || product.rating <= ratingTo)
    );

    if (keyword && keyword.trim() !== '') {
      const lowerQuery = keyword.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(lowerQuery) ||
          product.description.toLowerCase().includes(lowerQuery)
      );
    }

    const pageSize = 20;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    products = filteredProducts.slice(startIndex, endIndex);
    return { products, total: filteredProducts.length };
  }
}
