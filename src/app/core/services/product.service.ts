import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
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

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/?limit=100`);
  }

  searchProducts(
    query?: string,
    category?: string,
    brand?: string,
    priceFrom?: number,
    priceTo?: number
  ): Observable<Product[]> {
    const params = query ? new HttpParams().set('q', query) : new HttpParams();

    return this.http
      .get<Product[]>(`${this.apiUrl}/search`, { params })
      .pipe(
        map((products) =>
          this.filterProducts(products, category, brand, priceFrom, priceTo)
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
