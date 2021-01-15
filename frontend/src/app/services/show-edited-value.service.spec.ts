import { TestBed } from '@angular/core/testing';

import { ShowEditedValueService } from './show-edited-value.service';

describe('ShowEditedValueService', () => {
  let service: ShowEditedValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowEditedValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
