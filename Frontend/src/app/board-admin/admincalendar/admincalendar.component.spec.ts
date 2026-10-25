import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmincalendarComponent } from './admincalendar.component';

describe('AdmincalendarComponent', () => {
  let component: AdmincalendarComponent;
  let fixture: ComponentFixture<AdmincalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmincalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmincalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
