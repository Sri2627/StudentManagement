import { TestBed } from '@angular/core/testing';

import { AroleGuard } from './arole.guard';

describe('AroleGuard', () => {
  let guard: AroleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AroleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
