import { Component } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { PaginatorModule } from 'primeng/paginator';

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
  products: Product[] = [];
  categories: Category[] = [];
  selectedBrands = [];
  rangeValues: number[] = [1, 5];

  constructor(private productService: ProductService) {
    this.getProducts();
    this.getCategories();
  }

  private getProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  getCategories() {
    this.productService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }
}
