import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verification-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [class.verified]="isVerified" [class.unverified]="!isVerified">
      <svg *ngIf="isVerified" class="icon" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      {{ isVerified ? 'Verified Cause' : 'Pending Verification' }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    .verified {
      background-color: #dcfce7;
      color: #15803d;
      border: 1px solid #bbf7d0;
    }
    .unverified {
      background-color: #fef3c7;
      color: #b45309;
      border: 1px solid #fde68a;
    }
    .icon {
      width: 14px;
      height: 14px;
    }
  `]
})
export class VerificationBadge {
  @Input() isVerified: boolean = true;
}
