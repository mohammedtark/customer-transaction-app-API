import { TestBed } from '@angular/core/testing';

import { CustomerTransactionService } from './customer-transaction.service';

describe('CustomerTransactionService', () => {
  let service: CustomerTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
