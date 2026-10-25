import { TestBed } from '@angular/core/testing';

import { RazorService } from './razor.service';

describe('RazorService', () => {
  let service: RazorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RazorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
