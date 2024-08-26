import { Component, OnDestroy } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { combineLatest, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectCategories,
  selectProduct,
} from '../../../store/product/product.selectors';
import * as ProductActions from '../../../store/product/product.actions';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NgOptimizedImage, AsyncPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnDestroy {
  product$!: Observable<Product | null>;
  categories$: Observable<Category[] | null>;

  selectedImage!: string | undefined;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) {
    this.product$ = this.store.select(selectProduct);
    this.categories$ = this.store.select(selectCategories);
    this.getProduct();
    this.updateImageAndBreadcrumb();
  }

  private getProduct() {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(ProductActions.loadProduct({ id }));
    }
  }

  private updateImageAndBreadcrumb(): void {
    const findCategory = (
      product: Product | null,
      categories: Category[] | null
    ): Category | undefined => {
      return product && categories
        ? categories.find((c) => c.slug === product.category)
        : undefined;
    };

    combineLatest([this.product$, this.categories$])
      .pipe(
        takeUntil(this.destroy$),
        map(([product, categories]) => ({
          product,
          category: findCategory(product, categories),
        })),
        tap(({ product, category }) => {
          if (product) {
            this.selectedImage = product.images?.[0];
          }
          if (category && product) {
            this.breadcrumbService.addProduct(category, product);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
