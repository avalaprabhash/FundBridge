import { Injectable, signal, computed } from '@angular/core';
import { User, UserRole } from '../models';

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly userStorageKey = 'fundbridge_user';

  readonly currentUser = signal<User | null>(this.getStoredUser());
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly userRole = computed<UserRole>(() => this.currentUser()?.role || 'VISITOR');
  readonly isDonor = computed(() => this.userRole() === 'DONOR');
  readonly isCampaigner = computed(() => this.userRole() === 'CAMPAIGNER');
  readonly isAdmin = computed(() => this.userRole() === 'ADMIN' || this.userRole() === 'VERIFICATION_AGENT');

  private getStoredUser(): User | null {
    const raw = localStorage.getItem(this.userStorageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  login(credentials: { email: string; password: string }): boolean {
    let role: UserRole = 'DONOR';
    let name = 'Demo Donor';

    if (credentials.email.includes('admin')) {
      role = 'ADMIN';
      name = 'System Administrator';
    } else if (credentials.email.includes('fundraiser') || credentials.email.includes('campaigner')) {
      role = 'CAMPAIGNER';
      name = 'Rahul Sharma (Campaigner)';
    }

    const user: User = {
      id: 'usr_' + Date.now(),
      email: credentials.email,
      fullName: name,
      role: role,
      isEmailVerified: true,
      createdAt: new Date().toISOString()
    };

    this.currentUser.set(user);
    localStorage.setItem(this.userStorageKey, JSON.stringify(user));
    return true;
  }

  loginAsRole(role: UserRole) {
    const user: User = {
      id: 'usr_' + role.toLowerCase(),
      email: `${role.toLowerCase()}@fundbridge.com`,
      fullName: `${role} Demo User`,
      role: role,
      isEmailVerified: true,
      createdAt: new Date().toISOString()
    };
    this.currentUser.set(user);
    localStorage.setItem(this.userStorageKey, JSON.stringify(user));
  }

  register(data: { fullName: string; email: string; role: UserRole }): boolean {
    const user: User = {
      id: 'usr_' + Date.now(),
      email: data.email,
      fullName: data.fullName,
      role: data.role || 'DONOR',
      isEmailVerified: true,
      createdAt: new Date().toISOString()
    };
    this.currentUser.set(user);
    localStorage.setItem(this.userStorageKey, JSON.stringify(user));
    return true;
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem(this.userStorageKey);
  }
}
