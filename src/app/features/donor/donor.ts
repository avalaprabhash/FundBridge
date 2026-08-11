import { Component } from '@angular/core';
import { DonorLayout } from '../../layouts/donor-layout/donor-layout';

@Component({
  selector: 'app-donor',
  standalone: true,
  imports: [DonorLayout],
  templateUrl: './donor.html',
  styleUrl: './donor.css',
})
export class Donor { }
