import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  breadcrumbItems: MenuItem[] = [];

  constructor() {}

  toggleCategory(category?: Category) {
    const homeBreadcrumb = { icon: 'pi pi-home', route: '/' };
    const categoryBreadcrumb: MenuItem[] = category
      ? [
          {
            label: category.name,
            route: `/`,
            queryParams: { category: JSON.stringify(category) },
          },
        ]
      : [];

    this.breadcrumbItems = [homeBreadcrumb, ...categoryBreadcrumb];
  }

  addProduct(category: Category, product: Product) {
    this.toggleCategory(category);
    const productBreadcrumb: MenuItem = {
      label: product.title,
      route: `/product/${product.id}`,
    };
    this.breadcrumbItems = [...this.breadcrumbItems, productBreadcrumb];
  }
}
