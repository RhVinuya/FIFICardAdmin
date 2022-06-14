import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderThumbComponent } from './order-thumb.component';

describe('OrderThumbComponent', () => {
  let component: OrderThumbComponent;
  let fixture: ComponentFixture<OrderThumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderThumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderThumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
