import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';

import { Auth } from '../../../core/services/auth';
import { Register } from './register';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authSpy: { register: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authSpy = {
      register: vi.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([{ path: 'donor', component: Register }]), { provide: Auth, useValue: authSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should link to login', () => {
    fixture.detectChanges();

    const link = fixture.debugElement.query(By.directive(RouterLink));

    expect(link.injector.get(RouterLink).href).toContain('/login');
  });

  it('should submit valid registration data through the auth service', () => {
    component.registerForm.setValue({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'demo1234',
    });

    component.register();

    expect(authSpy.register).toHaveBeenCalledWith({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'demo1234',
    });
  });
});
