import { Component } from '@angular/core';
import { FundraiserLayout } from '../../layouts/fundraiser-layout/fundraiser-layout';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Campaign } from '../../core/services/campaigns/campaign';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fundraiser',
  standalone: true,
  imports: [FundraiserLayout, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './fundraiser.html',
  styleUrl: './fundraiser.css',
})
export class Fundraiser {
  fundRaiserForm;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private campServ: Campaign,
    private router: Router
  ) {
    this.fundRaiserForm = fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      targetAmount: ['', [Validators.required, Validators.min(1)]],
      image: ['', Validators.required]
    });
  }

  submit() {
    if (this.fundRaiserForm.invalid) {
      this.fundRaiserForm.markAllAsTouched();
      return;
    }

    const raw = this.fundRaiserForm.getRawValue();
    const newCamp = {
      title: raw.title,
      description: raw.description,
      targetAmount: parseFloat(raw.targetAmount as string),
      image: raw.image || 'https://images.unsplash.com/photo-1523324930923-4726b841a1db?w=600'
    };

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.campServ.addCamps(newCamp).subscribe({
      next: (createdCamp) => {
        this.loading = false;
        this.successMessage = 'Campaign created successfully!';
        this.fundRaiserForm.reset();
        setTimeout(() => {
          void this.router.navigate(['/donor']);
        }, 1200);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to create campaign. Please try again.';
      }
    });
  }
}
