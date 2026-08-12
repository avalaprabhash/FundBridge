import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';

import { Auth } from '../../../core/services/auth';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authSpy: { login: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authSpy = {
      login: vi.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([{ path: 'donor', component: Login }]), { provide: Auth, useValue: authSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should link to register', () => {
    fixture.detectChanges();

    const link = fixture.debugElement.query(By.directive(RouterLink));

    expect(link.injector.get(RouterLink).href).toContain('/register');
  });

  it('should submit valid credentials through the auth service', () => {
    component.loginForm.setValue({
      email: 'demo@example.com',
      password: 'demo1234',
    });

    component.login();

    expect(authSpy.login).toHaveBeenCalledWith({
      email: 'demo@example.com',
      password: 'demo1234',
    });
  });
});
