import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { Category } from '../../models/category.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  categories: Category[] = [];

  constructor(private productService: ProductService) {
    this.getCategories();
  }

  getCategories() {
    this.productService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }
}
