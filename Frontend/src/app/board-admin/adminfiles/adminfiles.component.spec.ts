import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminfilesComponent } from './adminfiles.component';

describe('AdminfilesComponent', () => {
  let component: AdminfilesComponent;
  let fixture: ComponentFixture<AdminfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminfilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
