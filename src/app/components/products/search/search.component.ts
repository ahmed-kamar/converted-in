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

  page: number = 1;
  totalRecords!: number;

  onPageChange(event: PaginatorState) {
    console.log(event);
    this.page = (event.page as number) + 1;
    this.getProducts();
  }

  constructor(private productService: ProductService) {
    this.getProducts();
    this.getCategories();
  }

  private getProducts() {
    this.productService.getProducts(this.page).subscribe((data) => {
      this.totalRecords = Math.min(data.limit, data.total);
      this.products = data.products;
    });
  }

  getCategories() {
    this.productService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }
}
