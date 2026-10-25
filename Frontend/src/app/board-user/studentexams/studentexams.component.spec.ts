import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentexamsComponent } from './studentexams.component';

describe('StudentexamsComponent', () => {
  let component: StudentexamsComponent;
  let fixture: ComponentFixture<StudentexamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentexamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentexamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
