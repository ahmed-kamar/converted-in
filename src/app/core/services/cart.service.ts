import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Product } from '../../core/models/product.model';
import * as CartActions from '../../store/cart/cart.actions';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private store: Store, private messageService: MessageService) {}

  addToCart(product: Product, quantity: number): void {
    this.store.dispatch(CartActions.addToCart({ product, quantity }));
    this.showSuccess('Quantity add successfully');
  }

  removeFromCart(productId: number): void {
    this.store.dispatch(CartActions.removeFromCart({ productId }));
    this.showSuccess('Product removed successfully');
  }

  loadCartFromLocalStorage(): void {
    this.store.dispatch(CartActions.loadCartFromLocalStorage());
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Cart',
      detail: message,
    });
  }
}
