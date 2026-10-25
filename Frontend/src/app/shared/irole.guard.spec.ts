import { TestBed } from '@angular/core/testing';

import { IroleGuard } from './irole.guard';

describe('IroleGuard', () => {
  let guard: IroleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IroleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
