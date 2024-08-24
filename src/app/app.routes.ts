import { Routes } from '@angular/router';
import { SearchComponent } from './components/products/search/search.component';

export const routes: Routes = [
  { path: '', component: SearchComponent, pathMatch: 'full' },
  {
    path: 'product/:id',
    loadComponent: () =>
      import(
        './components/products/product-details/product-details.component'
      ).then((m) => m.ProductDetailsComponent),
  },
  { path: '**', redirectTo: '' },
];
