import { TestBed } from '@angular/core/testing';

import { ExamtitlesService } from './examtitles.service';

describe('ExamtitlesService', () => {
  let service: ExamtitlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamtitlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
