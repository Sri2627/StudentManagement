import { TestBed } from '@angular/core/testing';

import { TotalresultsService } from './totalresults.service';

describe('TotalresultsService', () => {
  let service: TotalresultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TotalresultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
