import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignAndSendDialogComponent } from './sign-and-send-dialog.component';

describe('SignAndSendDialogComponent', () => {
  let component: SignAndSendDialogComponent;
  let fixture: ComponentFixture<SignAndSendDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignAndSendDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignAndSendDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
