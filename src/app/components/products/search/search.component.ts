import { Component } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { AsyncPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Brand } from '../../../core/models/brand.modal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { map, Observable, startWith, Subject, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectBrands,
  selectCategories,
  selectProducts,
} from '../../../store/product/product.selectors';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    FormsModule,
    CheckboxModule,
    SliderModule,
    PaginatorModule,
    NgClass,
    AsyncPipe,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  selectedBrands!: string[];
  selectedCategory!: Category | undefined;
  searchKeyword: string = '';
  rangeRating: number[] = [1, 5];
  priceFrom!: number;
  priceTo!: number;

  menuOpend: boolean = false;

  products$!: Observable<Product[] | null>;
  filteredProducts$!: Observable<Product[] | null>;
  categories$!: Observable<Category[] | null>;
  brands$!: Observable<Brand[] | null>;
  private filterChanged$ = new Subject<void>();

  page: number = 1;
  totalProducts!: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private store: Store,
    private productService: ProductService
  ) {
    this.initVariables();
    this.onQueryParamsChange();
  }

  private initVariables() {
    this.products$ = this.store.select(selectProducts);
    this.categories$ = this.store.select(selectCategories);
    this.brands$ = this.store.select(selectBrands);
    this.filteredProducts$ = this.filterChanged$.pipe(
      startWith(undefined),
      switchMap(() => this.products$),
      map((products) => {
        const filteredProducts = this.productService.filterProducts(
          products || [],
          this.page,
          this.rangeRating[0],
          this.rangeRating[1],
          this.selectedBrands,
          this.priceFrom,
          this.priceTo,
          this.selectedCategory?.slug,
          this.searchKeyword
        );

        this.totalProducts = filteredProducts.total;
        return filteredProducts.products;
      })
    );
  }

  private onQueryParamsChange() {
    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        this.searchKeyword = params['searchKeyword'];

        const category = params['category'];
        if (category) {
          this.selectedCategory = JSON.parse(category);
        } else {
          this.selectedCategory = undefined;
        }
        this.breadcrumbService.toggleCategory(this.selectedCategory);
        this.onFilterChange();
      });
  }

  onPageChange(event: PaginatorState) {
    this.page = (event.page as number) + 1;
    this.filterChanged$.next();
  }

  onSelectCategory(category: Category) {
    if (category.slug === this.selectedCategory?.slug) {
      this.selectedCategory = undefined;
    } else {
      this.selectedCategory = category;
    }
    this.breadcrumbService.toggleCategory(this.selectedCategory);

    this.router.navigate([''], {
      relativeTo: this.activatedRoute,
      queryParams: {
        category: this.selectedCategory
          ? JSON.stringify(this.selectedCategory)
          : undefined,
      },
      queryParamsHandling: 'merge',
    });

    this.onFilterChange();
  }

  onFilterChange() {
    this.page = 1;
    this.filterChanged$.next();
  }
}
