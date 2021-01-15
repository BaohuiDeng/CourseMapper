import { TestBed } from '@angular/core/testing';

import { NewSubCategoryService } from './new-sub-category.service';

describe('NewSubCategoryService', () => {
  let service: NewSubCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewSubCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
