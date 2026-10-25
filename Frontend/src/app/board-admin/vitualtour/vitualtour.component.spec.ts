import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitualtourComponent } from './vitualtour.component';

describe('VitualtourComponent', () => {
  let component: VitualtourComponent;
  let fixture: ComponentFixture<VitualtourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VitualtourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VitualtourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
