import { createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { CartItem } from '../../core/models/cart.model';

export interface CartState {
  items: CartItem[];
}

export const initialState: CartState = {
  items: [],
};

export const cartReducer = createReducer(
  initialState,
  on(CartActions.addToCart, (state, { product, quantity }) => {
    const item = state.items.find((item) => item.product.id === product.id);
    if (item) {
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id == product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        ),
      };
    } else {
      return {
        ...state,
        items: [...state.items, { product, quantity }],
      };
    }
  }),
  on(CartActions.removeFromCart, (state, { productId }) => ({
    ...state,
    items: state.items.filter((item) => item.product.id != productId),
  })),
  on(CartActions.loadCartFromLocalStorageSuccess, (state, { items }) => ({
    ...state,
    items,
  }))
);
