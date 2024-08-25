import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { Category } from '../../models/category.model';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  categories: Category[] = [];

  searchKeyword: string = '';
  selectedCategory!: Category | undefined;

  constructor(
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.getCategories();
  }

  getCategories() {
    this.productService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  onSelectCategory(category: Category) {
    if (this.selectedCategory?.slug === category.slug) {
      this.selectedCategory = undefined;
    } else {
      this.selectedCategory = category;
    }
    this.updateQueryParams();
  }

  updateQueryParams() {
    this.router.navigate([''], {
      relativeTo: this.activatedRoute,
      queryParams: {
        searchKeyword:
          this.searchKeyword.trim() === '' ? undefined : this.searchKeyword,
        category: this.selectedCategory
          ? JSON.stringify(this.selectedCategory)
          : undefined,
      },
      queryParamsHandling: 'merge',
    });
  }
}
