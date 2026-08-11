import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';

import { Auth } from '../services/auth';
import { authGuard } from './guard-guard';

describe('authGuard', () => {
  let authSpy: { isLoggedIn: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authSpy = {
      isLoggedIn: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: Auth, useValue: authSpy }],
    });
  });

  it('should allow navigation when the user is logged in', () => {
    authSpy.isLoggedIn.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(result).toBe(true);
  });

  it('should redirect to login when the user is logged out', () => {
    authSpy.isLoggedIn.mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/login');
  });
});
