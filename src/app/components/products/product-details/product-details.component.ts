import { Component } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {
  product!: Product;
  selectedImage!: string;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {
    this.getProducts();
  }

  private getProducts() {
    const productId: string | null = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProduct(productId).subscribe((data) => {
        this.selectedImage = data?.images?.[0];
        this.product = data;
      });
    }
  }
}
