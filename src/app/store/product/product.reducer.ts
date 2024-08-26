import { createReducer, on } from '@ngrx/store';
import * as ProductActions from './product.actions';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { Brand } from '../../core/models/brand.modal';

export interface ProductState {
  products: Product[] | null;
  categories: Category[] | null;
  brands: Brand[] | null;
  error: any;
}

export const initialState: ProductState = {
  products: null,
  categories: null,
  brands: null,
  error: null,
};

export const productReducer = createReducer(
  initialState,
  on(ProductActions.loadProductsSuccess, (state, { products, brands }) => ({
    ...state,
    products,
    brands,
    error: null,
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(ProductActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
    error: null,
  })),
  on(ProductActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(ProductActions.setBrands, (state, { brands }) => ({
    ...state,
    brands,
    error: null,
  }))
);
