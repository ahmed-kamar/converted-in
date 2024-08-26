import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './core/components/header/header.component';
import { BreadcrumbComponent } from './core/components/breadcrumb/breadcrumb.component';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import * as ProductActions from './store/product/product.actions';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, BreadcrumbComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(ProductActions.loadProducts());
    this.store.dispatch(ProductActions.loadCategories());
  }
}
