import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsyllabusComponent } from './tsyllabus.component';

describe('TsyllabusComponent', () => {
  let component: TsyllabusComponent;
  let fixture: ComponentFixture<TsyllabusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TsyllabusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TsyllabusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
