import { Component } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Brand } from '../../../core/models/brand.modal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    NgClass,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  products!: Product[];
  categories!: Category[];
  brands!: Brand[];

  selectedBrands!: string[];
  selectedCategory!: Category | undefined;
  searchKeyword: string = '';
  rangeRating: number[] = [1, 5];
  priceFrom!: number;
  priceTo!: number;

  page: number = 1;
  totalProducts!: number;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute
  ) {
    this.onQueryParamsChange();
    this.getProducts();
    this.getCategories();
  }

  onQueryParamsChange() {
    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        this.searchKeyword = params['searchKeyword'];

        const category = params['category'];
        if (category) {
          this.selectedCategory = JSON.parse(category);
        } else {
          this.selectedCategory = undefined;
        }
        this.onFilterChange();
      });
  }

  private getProducts() {
    this.productService
      .getProducts(
        this.page,
        this.rangeRating[0],
        this.rangeRating[1],
        this.selectedBrands,
        this.priceFrom,
        this.priceTo,
        this.selectedCategory?.slug,
        this.searchKeyword
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

  onSelectCategory(category: Category) {
    if (category.slug === this.selectedCategory?.slug) {
      this.selectedCategory = undefined;
    } else {
      this.selectedCategory = category;
    }
    this.onFilterChange();
  }

  onFilterChange() {
    this.page = 1;
    this.getProducts();
  }
}
