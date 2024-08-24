import { Component } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgOptimizedImage,RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  products: Product[] = [];

  constructor(private productService: ProductService) {
    this.getProducts();
  }

  private getProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }
}
