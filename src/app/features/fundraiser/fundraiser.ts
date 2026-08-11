import { Component } from '@angular/core';
import { FundraiserLayout } from '../../layouts/fundraiser-layout/fundraiser-layout';

@Component({
  selector: 'app-fundraiser',
  standalone: true,
  imports: [FundraiserLayout],
  templateUrl: './fundraiser.html',
  styleUrl: './fundraiser.css',
})
export class Fundraiser { }
