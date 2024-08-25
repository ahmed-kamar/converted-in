import { Injectable } from '@angular/core';
import { Product, ProductResponse } from '../models/product.model';
import { Category } from '../models/category.model';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProducts(
    page: number,
    query?: string,
    category?: string,
    brand?: string,
    priceFrom?: number,
    priceTo?: number
  ): Observable<ProductResponse> {
    let params = new HttpParams().set('limit', '100');

    return this.http
      .get<ProductResponse>(`${this.apiUrl}/search`, { params })
      .pipe(
        map((response) => ({
          ...response, // Spread the existing properties (skip, total, limit)
          products: this.filterProducts(
            response.products,
            page,
            query,
            category,
            brand,
            priceFrom,
            priceTo
          ),
        }))
      );
  }

  private filterProducts(
    products: Product[],
    page: number = 1,
    query?: string,
    category?: string,
    brand?: string,
    priceFrom?: number,
    priceTo?: number
  ): Product[] {
    let filteredProducts = products.filter(
      (product) =>
        (!category || product.category === category) &&
        (!brand || product.brand === brand) &&
        (priceFrom == null || product.price >= priceFrom) &&
        (priceTo == null || product.price <= priceTo)
    );

    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(lowerQuery) ||
          product.description.toLowerCase().includes(lowerQuery)
      );
    }

    const pageSize = 20;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredProducts.slice(startIndex, endIndex);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }
}
