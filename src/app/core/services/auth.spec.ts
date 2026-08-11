import { TestBed } from '@angular/core/testing';

import { Auth } from './auth';

describe('Auth', () => {
  let service: Auth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Auth);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login with the demo credentials', () => {
    const result = service.login({
      email: 'admin@g',
      password: 'admin',
    });

    expect(result).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should reject invalid credentials', () => {
    const result = service.login({
      email: 'wrong@example.com',
      password: 'wrong-pass',
    });

    expect(result).toBe(false);
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should mark the user as logged in after register', () => {
    const result = service.register({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'demo1234',
    });

    expect(result).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
  });
});
