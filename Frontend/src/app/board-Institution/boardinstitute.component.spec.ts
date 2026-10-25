import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardinstituteComponent } from './boardinstitute.component';

describe('BoardinstituteComponent', () => {
  let component: BoardinstituteComponent;
  let fixture: ComponentFixture<BoardinstituteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardinstituteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardinstituteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
