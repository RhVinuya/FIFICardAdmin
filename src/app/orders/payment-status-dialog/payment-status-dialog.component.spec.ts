import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentStatusDialogComponent } from './payment-status-dialog.component';

describe('PaymentStatusDialogComponent', () => {
  let component: PaymentStatusDialogComponent;
  let fixture: ComponentFixture<PaymentStatusDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentStatusDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
