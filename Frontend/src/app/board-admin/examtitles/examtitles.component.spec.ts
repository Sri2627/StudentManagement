import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamtitlesComponent } from './examtitles.component';

describe('ExamtitlesComponent', () => {
  let component: ExamtitlesComponent;
  let fixture: ComponentFixture<ExamtitlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamtitlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamtitlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
