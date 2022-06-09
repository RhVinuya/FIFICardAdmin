import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFixComponent } from './data-fix.component';

describe('DataFixComponent', () => {
  let component: DataFixComponent;
  let fixture: ComponentFixture<DataFixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataFixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
