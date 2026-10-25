import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfileboxComponent } from './tfilebox.component';

describe('TfileboxComponent', () => {
  let component: TfileboxComponent;
  let fixture: ComponentFixture<TfileboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TfileboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TfileboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
