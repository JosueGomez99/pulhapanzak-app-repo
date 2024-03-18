import { TestBed } from '@angular/core/testing';

import { AuthRegistroService } from './auth-registro.service';

describe('AuthRegistroService', () => {
  let service: AuthRegistroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthRegistroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
