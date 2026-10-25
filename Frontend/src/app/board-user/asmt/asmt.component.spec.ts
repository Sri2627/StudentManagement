import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsmtComponent } from './asmt.component';

describe('AsmtComponent', () => {
  let component: AsmtComponent;
  let fixture: ComponentFixture<AsmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
