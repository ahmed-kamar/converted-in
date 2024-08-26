import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailsComponent } from './product-details.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import * as ProductActions from '../../../store/product/product.actions';
import { CartService } from '../../../core/services/cart.service';

describe('ProductDetailsComponent - getProduct', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let store: MockStore;

  const setupTestBed = (paramMapValue: any) => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        StoreModule.forRoot({}),
        ProductDetailsComponent,
      ],
      providers: [
        provideMockStore(),
        CartService,
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => paramMapValue } } },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
  };

  it('should dispatch loadProduct action with ID when ID is present', () => {
    setupTestBed('1');

    const dispatchSpy = spyOn(store, 'dispatch');
    component['getProduct']();
    expect(dispatchSpy).toHaveBeenCalledWith(
      ProductActions.loadProduct({ id: '1' })
    );
  });

  it('should not dispatch loadProduct action when ID is not present', () => {
    setupTestBed(null);

    const dispatchSpy = spyOn(store, 'dispatch');
    component['getProduct']();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
