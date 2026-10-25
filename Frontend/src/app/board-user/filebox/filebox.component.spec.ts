import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileboxComponent } from './filebox.component';

describe('FileboxComponent', () => {
  let component: FileboxComponent;
  let fixture: ComponentFixture<FileboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
