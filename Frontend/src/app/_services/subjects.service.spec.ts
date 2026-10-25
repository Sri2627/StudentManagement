import { TestBed } from '@angular/core/testing';

import { SubjectService } from './SubjectService';

describe('SubjectsService', () => {
  let service: SubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
