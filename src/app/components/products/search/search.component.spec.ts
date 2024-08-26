import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { ProductService } from '../../../core/services/product.service';

import { PaginatorState } from 'primeng/paginator';
import { RouterTestingModule } from '@angular/router/testing';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [provideMockStore({}), BreadcrumbService, ProductService],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize variables and observables correctly', () => {
    expect(component.products$).toBeTruthy();
    expect(component.filteredProducts$).toBeTruthy();
    expect(component.categories$).toBeTruthy();
    expect(component.brands$).toBeTruthy();
    expect(component.page).toBe(1);
  });

  it('should update page and trigger filter change on pagination', () => {
    spyOn(component['filterChanged$'], 'next');
    const paginatorState: PaginatorState = { page: 1, rows: 10 };

    component.onPageChange(paginatorState);

    expect(component.page).toBe(2);
    expect(component['filterChanged$'].next).toHaveBeenCalled();
  });
});
