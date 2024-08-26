import { createAction, props } from '@ngrx/store';
import { Product } from '../../core/models/product.model';
import { CartItem } from '../../core/models/cart.model';

export const addToCart = createAction(
  '[Cart] Add to Cart',
  props<{ product: Product; quantity: number }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove from Cart',
  props<{ productId: number }>()
);

export const loadCartFromLocalStorage = createAction(
  '[Cart] Load Cart From Local Storage'
);

export const loadCartFromLocalStorageSuccess = createAction(
  '[Cart] Load Cart From Local Storage Success',
  props<{ items: CartItem[] }>()
);
