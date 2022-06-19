import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingFeeComponent } from './shipping-fee.component';

describe('ShippingFeeComponent', () => {
  let component: ShippingFeeComponent;
  let fixture: ComponentFixture<ShippingFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
