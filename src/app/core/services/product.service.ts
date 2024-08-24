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
    query?: string,
    category?: string,
    brand?: string,
    priceFrom?: number,
    priceTo?: number
  ): Observable<Product[]> {
    let params = new HttpParams().set('limit', '100');

    if (query) {
      params = params.set('q', query);
    }

    return this.http
      .get<ProductResponse>(`${this.apiUrl}/search`, { params })
      .pipe(
        map((response) =>
          this.filterProducts(
            response.products,
            category,
            brand,
            priceFrom,
            priceTo
          )
        )
      );
  }

  private filterProducts(
    products: Product[],
    category?: string,
    brand?: string,
    priceFrom?: number,
    priceTo?: number
  ): Product[] {
    return products.filter(
      (product) =>
        (!category || product.category === category) &&
        (!brand || product.brand === brand) &&
        (priceFrom == null || product.price >= priceFrom) &&
        (priceTo == null || product.price <= priceTo)
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }
}
