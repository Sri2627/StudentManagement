import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScalenderComponent } from './scalender.component';

describe('ScalenderComponent', () => {
  let component: ScalenderComponent;
  let fixture: ComponentFixture<ScalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScalenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
