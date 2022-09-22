import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeUpgradeComponent } from './type-upgrade.component';

describe('TypeUpgradeComponent', () => {
  let component: TypeUpgradeComponent;
  let fixture: ComponentFixture<TypeUpgradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeUpgradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
