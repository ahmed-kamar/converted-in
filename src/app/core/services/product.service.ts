import { Injectable } from '@angular/core';
import { Product, ProductResponse } from '../models/product.model';
import { Category } from '../models/category.model';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Brand } from '../models/brand.modal';

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
    brand: string[],
    priceFrom?: number,
    priceTo?: number,
    category?: string,
    keyword?: string
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
            brand,
            priceFrom,
            priceTo,
            category,
            keyword
          )
        )
      );
  }

  private filterProductsRespone(
    productResponse: ProductResponse,
    page: number = 1,
    ratingFrom: number,
    ratingTo: number,
    brand: string[],
    priceFrom?: number,
    priceTo?: number,
    category?: string,
    keyword?: string
  ): ProductResponse {
    productResponse.brands = this.getBrands(productResponse.products);

    let filteredProducts = productResponse.products.filter(
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

    productResponse.total = filteredProducts.length;

    const pageSize = 20;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    productResponse.products = filteredProducts.slice(startIndex, endIndex);
    return productResponse;
  }

  private getBrands(products: Product[]): Brand[] {
    const brandCounts = products.reduce<{ [key: string]: number }>(
      (counts, product) => {
        if (product.brand) {
          counts[product.brand] = (counts[product.brand] || 0) + 1;
        }
        return counts;
      },
      {}
    );

    return Object.entries(brandCounts)
      .filter(([name]) => name !== undefined)
      .map(([name, count]) => ({
        name,
        count,
      }));
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }
}
