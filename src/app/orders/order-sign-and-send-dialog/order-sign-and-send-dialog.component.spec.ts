import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSignAndSendDialogComponent } from './order-sign-and-send-dialog.component';

describe('OrderSignAndSendDialogComponent', () => {
  let component: OrderSignAndSendDialogComponent;
  let fixture: ComponentFixture<OrderSignAndSendDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSignAndSendDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSignAndSendDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
