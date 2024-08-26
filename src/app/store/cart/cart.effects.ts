import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, switchMap, map } from 'rxjs/operators';
import * as CartActions from './cart.actions';
import { selectCartState } from './cart.selectors';
import { Store, select } from '@ngrx/store';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);

  constructor(private store: Store) {}

  saveCartToLocalStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CartActions.addToCart,
          CartActions.removeFromCart
        ),
        switchMap(() =>
          this.store.pipe(
            select(selectCartState),
            tap((cartState) => {
              localStorage.setItem('cart', JSON.stringify(cartState.items));
            })
          )
        )
      ),
    { dispatch: false }
  );

  loadCartFromLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCartFromLocalStorage),
      map(() => {
        const items = JSON.parse(localStorage.getItem('cart') || '[]');
        return CartActions.loadCartFromLocalStorageSuccess({ items });
      })
    )
  );
}
