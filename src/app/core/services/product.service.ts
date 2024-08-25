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
    ratingFrom: number,
    ratingTo: number,
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
        map((response) =>
          this.filterProductsRespone(
            response,
            page,
            ratingFrom,
            ratingTo,
            query,
            category,
            brand,
            priceFrom,
            priceTo
          )
        )
      );
  }

  private filterProductsRespone(
    productResponse: ProductResponse,
    page: number = 1,
    ratingFrom: number,
    ratingTo: number,
    query?: string,
    category?: string,
    brand?: string,
    priceFrom?: number,
    priceTo?: number
  ): ProductResponse {
    let filteredProducts = productResponse.products.filter(
      (product) =>
        (!category || product.category === category) &&
        (!brand || product.brand === brand) &&
        (priceFrom == null || product.price >= priceFrom) &&
        (priceTo == null || product.price <= priceTo) &&
        (ratingFrom == null || product.rating >= ratingFrom) &&
        (ratingTo == null || product.rating <= ratingTo)
    );

    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(lowerQuery) ||
          product.description.toLowerCase().includes(lowerQuery)
      );
    }

    productResponse.total = filteredProducts.length;

    const pageSize = 20;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    productResponse.products = filteredProducts.slice(startIndex, endIndex);
    return productResponse;
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }
}
