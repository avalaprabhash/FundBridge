import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-donor-layout',
  imports: [RouterLink],
  templateUrl: './donor-layout.html',
  styleUrl: './donor-layout.css',
})
export class DonorLayout {
  constructor(private as: Auth, private router: Router) { }

  logout() {
    this.as.logout();
    this.router.navigate(['/']);
  }
}
