import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-fundraiser-layout',
  imports: [RouterLink],
  templateUrl: './fundraiser-layout.html',
  styleUrl: './fundraiser-layout.css',
})
export class FundraiserLayout {
  constructor(private as: Auth, private router: Router) { }

  logout() {
    this.as.logout();
    this.router.navigate(['/login']);
  }
}
