import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { UserRole } from '../../core/models';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {
  auth = inject(Auth);
  private router = inject(Router);

  switchRole(role: UserRole) {
    this.auth.loginAsRole(role);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  home() {
    this.router.navigate(['/']);
  }
}
