import { Component } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Brand } from '../../../core/models/brand.modal';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    FormsModule,
    CheckboxModule,
    SliderModule,
    PaginatorModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  products!: Product[];
  categories!: Category[];
  brands!: Brand[];

  selectedBrands!: string[];
  rangeRating: number[] = [1, 5];
  priceFrom!: number;
  priceTo!: number;

  page: number = 1;
  totalProducts!: number;

  constructor(private productService: ProductService) {
    this.getProducts();
    this.getCategories();
  }

  private getProducts() {
    this.productService
      .getProducts(
        this.page,
        this.rangeRating[0],
        this.rangeRating[1],
        this.selectedBrands,
        this.priceFrom,
        this.priceTo
      )
      .subscribe((data) => {
        this.totalProducts = data.total;
        this.products = data.products;
        this.brands = data.brands;
      });
  }

  getCategories() {
    this.productService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  onPageChange(event: PaginatorState) {
    this.page = (event.page as number) + 1;
    this.getProducts();
  }

  onPriceRangeChange() {
    this.page = 1;
    this.getProducts();
  }

  onSelectBrandChange() {
    this.page = 1;
    this.getProducts();
  }

  onRangeRatingChange() {
    this.page = 1;
    this.getProducts();
  }
}
