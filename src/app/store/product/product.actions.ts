import { createAction, props } from '@ngrx/store';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { Brand } from '../../core/models/brand.modal';

export const loadProducts = createAction('[Product] Load Products');
export const loadProductsSuccess = createAction(
  '[Product] Load Products Success',
  props<{ products: Product[]; brands: Brand[] }>()
);
export const loadProductsFailure = createAction(
  '[Product] Load Products Failure',
  props<{ error: any }>()
);

// Actions for loading product details
export const loadProduct = createAction(
  '[Product] Load Product',
  props<{ id: string }>()
);
export const loadProductSuccess = createAction(
  '[Product] Load Product Success',
  props<{ product: Product }>()
);
export const loadProductFailure = createAction(
  '[Product] Load Product Failure',
  props<{ error: any }>()
);

export const loadCategories = createAction('[Category] Load Categories');
export const loadCategoriesSuccess = createAction(
  '[Category] Load Categories Success',
  props<{ categories: Category[] }>()
);
export const loadCategoriesFailure = createAction(
  '[Category] Load Categories Failure',
  props<{ error: any }>()
);

export const setBrands = createAction(
  '[Product] Set Brands',
  props<{ brands: Brand[] }>()
);
