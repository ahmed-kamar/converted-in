import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { Category } from '../../models/category.model';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { Store } from '@ngrx/store';
import { selectCartItems } from '../../../store/cart/cart.selectors';
import { selectCategories } from '../../../store/product/product.selectors';
import { CartItem } from '../../models/cart.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, FormsModule, OverlayPanelModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  cartItems$!: Observable<CartItem[] | null>;
  categories$: Observable<Category[] | null>;

  searchKeyword: string = '';
  selectedCategory!: Category | undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private store: Store
  ) {
    this.cartItems$ = this.store.select(selectCartItems);
    this.categories$ = this.store.select(selectCategories);
    this.cartService.loadCartFromLocalStorage();
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  onSelectCategory(category: Category) {
    if (this.selectedCategory?.slug === category.slug) {
      this.selectedCategory = undefined;
    } else {
      this.selectedCategory = category;
    }
    this.updateQueryParams();
  }

  updateQueryParams() {
    this.router.navigate([''], {
      relativeTo: this.activatedRoute,
      queryParams: {
        searchKeyword:
          this.searchKeyword.trim() === '' ? undefined : this.searchKeyword,
        category: this.selectedCategory
          ? JSON.stringify(this.selectedCategory)
          : undefined,
      },
      queryParamsHandling: 'merge',
    });
  }
}
