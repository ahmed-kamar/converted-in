import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import * as ProductActions from './product.actions';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { Brand } from '../../core/models/brand.modal';

@Injectable()
export class ProductEffects {
  private actions$ = inject(Actions);

  constructor(private productService: ProductService) {}

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      mergeMap(() =>
        this.productService.getProducts().pipe(
          map((response) => {
            const products = response;
            const brands = this.getBrands(products);
            return ProductActions.loadProductsSuccess({ products, brands });
          }),
          catchError((error) =>
            of(ProductActions.loadProductsFailure({ error }))
          )
        )
      )
    )
  );

  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProduct),
      switchMap(({ id }) =>
        this.productService.getProduct(id).pipe(
          map((product) => ProductActions.loadProductSuccess({ product })),
          catchError((error) =>
            of(ProductActions.loadProductFailure({ error }))
          )
        )
      )
    )
  );

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadCategories), // Listening for loadCategories action
      mergeMap(() =>
        this.productService.getCategories().pipe(
          map((categories) =>
            ProductActions.loadCategoriesSuccess({ categories })
          ),
          catchError((error) =>
            of(ProductActions.loadCategoriesFailure({ error }))
          )
        )
      )
    )
  );

  // Method to extract brands from products
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
}
