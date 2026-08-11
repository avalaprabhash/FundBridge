import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Campaign } from '../../../core/models';
import { ProgressBar } from '../progress-bar/progress-bar';
import { VerificationBadge } from '../verification-badge/verification-badge';

@Component({
  selector: 'app-campaign-card',
  standalone: true,
  imports: [CommonModule, RouterLink, ProgressBar, VerificationBadge],
  template: `
    <article class="campaign-card" *ngIf="campaign">
      <div class="image-wrapper">
        <img [src]="campaign.coverImageUrl" [alt]="campaign.title" class="cover-image" />
        <div class="category-pill">{{ campaign.categoryName }}</div>
        <div class="tax-pill" *ngIf="campaign.taxBenefitAvailable">80G Tax Benefit</div>
      </div>

      <div class="content">
        <div class="badge-row">
          <app-verification-badge [isVerified]="campaign.isVerifiedBadge"></app-verification-badge>
          <span class="location">{{ campaign.location }}</span>
        </div>

        <h3 class="title">
          <a [routerLink]="['/campaign', campaign.id]">{{ campaign.title }}</a>
        </h3>

        <p class="tagline">{{ campaign.tagline }}</p>

        <div class="beneficiary-meta">
          <span class="label">Beneficiary: </span>
          <span class="val">{{ campaign.beneficiaryName }}</span>
        </div>

        <div class="progress-section">
          <app-progress-bar [percentage]="percentageRaised"></app-progress-bar>
        </div>

        <div class="financial-row">
          <div class="raised">
            <span class="amt">{{ campaign.currency }}{{ campaign.raisedAmount | number }}</span>
            <span class="lbl">raised of {{ campaign.currency }}{{ campaign.targetGoalAmount | number }}</span>
          </div>
          <div class="donors">
            <span class="count">{{ campaign.donorCount }}</span>
            <span class="lbl">Donors</span>
          </div>
        </div>

        <div class="card-actions">
          <a [routerLink]="['/campaign', campaign.id]" class="btn-donate">Donate Now</a>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .campaign-card {
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.06);
      border: 1px solid #e2e8f0;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .campaign-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px -4px rgba(0, 0, 0, 0.12);
    }
    .image-wrapper {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
    }
    .cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .category-pill {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(15, 23, 42, 0.85);
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 9999px;
      backdrop-filter: blur(4px);
    }
    .tax-pill {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #16a34a;
      color: #ffffff;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .content {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .badge-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .location {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }
    .title {
      font-size: 1.05rem;
      font-weight: 700;
      line-height: 1.4;
      margin: 0 0 8px 0;
      color: #0f172a;
    }
    .title a {
      color: inherit;
      text-decoration: none;
    }
    .title a:hover {
      color: #0284c7;
    }
    .tagline {
      font-size: 0.85rem;
      color: #475569;
      line-height: 1.5;
      margin: 0 0 14px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .beneficiary-meta {
      font-size: 0.8rem;
      color: #64748b;
      margin-bottom: 14px;
    }
    .beneficiary-meta .val {
      font-weight: 600;
      color: #334155;
    }
    .progress-section {
      margin-bottom: 14px;
    }
    .financial-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 10px;
      border-top: 1px solid #f1f5f9;
      margin-top: auto;
    }
    .financial-row .amt {
      display: block;
      font-size: 1.05rem;
      font-weight: 800;
      color: #0f172a;
    }
    .financial-row .lbl {
      display: block;
      font-size: 0.75rem;
      color: #64748b;
    }
    .financial-row .count {
      display: block;
      font-size: 1.05rem;
      font-weight: 800;
      color: #0284c7;
      text-align: right;
    }
    .card-actions {
      margin-top: 16px;
    }
    .btn-donate {
      display: block;
      width: 100%;
      text-align: center;
      background: linear-gradient(135deg, #0284c7, #2563eb);
      color: #ffffff;
      font-weight: 700;
      font-size: 0.9rem;
      padding: 10px 0;
      border-radius: 10px;
      text-decoration: none;
      transition: background 0.2s ease;
    }
    .btn-donate:hover {
      background: linear-gradient(135deg, #0369a1, #1d4ed8);
    }
  `]
})
export class CampaignCard {
  @Input() campaign!: Campaign;

  get percentageRaised(): number {
    if (!this.campaign || !this.campaign.targetGoalAmount) return 0;
    return (this.campaign.raisedAmount / this.campaign.targetGoalAmount) * 100;
  }
}
