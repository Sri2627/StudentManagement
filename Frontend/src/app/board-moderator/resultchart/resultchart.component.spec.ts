import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultchartComponent } from './resultchart.component';

describe('ResultchartComponent', () => {
  let component: ResultchartComponent;
  let fixture: ComponentFixture<ResultchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
