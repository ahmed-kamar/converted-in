import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ProductState } from './product.reducer';

export const selectProductState =
  createFeatureSelector<ProductState>('products');

export const selectProducts = createSelector(
  selectProductState,
  (state: ProductState) => state.products
);

export const selectCategories = createSelector(
  selectProductState,
  (state: ProductState) => state.categories
);

export const selectBrands = createSelector(
  selectProductState,
  (state: ProductState) => state.brands
);
