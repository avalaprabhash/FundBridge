import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CampaignService } from '../../core/services/campaign';
import { Campaign, CampaignUpdate } from '../../core/models';
import { ProgressBar } from '../../shared/components/progress-bar/progress-bar';
import { VerificationBadge } from '../../shared/components/verification-badge/verification-badge';

@Component({
  selector: 'app-campaign-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProgressBar, VerificationBadge],
  template: `
    <div class="details-page" *ngIf="campaign(); else loadingOrNotFound">
      <div class="container main-layout">
        <!-- Main Content Left Column -->
        <main class="content-left">
          <header class="campaign-header">
            <div class="category-tag">{{ campaign()!.categoryName }}</div>
            <h1 class="title">{{ campaign()!.title }}</h1>

            <div class="meta-row">
              <app-verification-badge [isVerified]="campaign()!.isVerifiedBadge"></app-verification-badge>
              <span class="location">📍 {{ campaign()!.location }}</span>
              <span class="tax-tag" *ngIf="campaign()!.taxBenefitAvailable">🛡️ 80G Tax Benefit Eligible</span>
            </div>
          </header>

          <div class="cover-media">
            <img [src]="campaign()!.coverImageUrl" [alt]="campaign()!.title" />
          </div>

          <!-- Organizer & Beneficiary Info Card -->
          <section class="trust-card">
            <div class="entity-box">
              <span class="lbl">Fundraiser Organizer</span>
              <span class="val">{{ campaign()!.campaignerName }}</span>
            </div>
            <div class="divider"></div>
            <div class="entity-box">
              <span class="lbl">Direct Beneficiary</span>
              <span class="val">{{ campaign()!.beneficiaryName }}</span>
            </div>
          </section>

          <!-- Tabs Navigation -->
          <nav class="details-tabs">
            <button [class.active]="activeTab() === 'STORY'" (click)="activeTab.set('STORY')">Story & Cause</button>
            <button [class.active]="activeTab() === 'UPDATES'" (click)="activeTab.set('UPDATES')">
              Updates ({{ updates().length }})
            </button>
            <button [class.active]="activeTab() === 'DOCS'" (click)="activeTab.set('DOCS')">Verified Documents</button>
          </nav>

          <!-- Tab Content: Story -->
          <article class="tab-pane" *ngIf="activeTab() === 'STORY'">
            <div class="story-content" [innerHTML]="campaign()!.storyHtml"></div>
          </article>

          <!-- Tab Content: Updates -->
          <article class="tab-pane" *ngIf="activeTab() === 'UPDATES'">
            <div *ngIf="updates().length === 0" class="no-updates">
              No updates posted yet by the fundraiser.
            </div>
            <div class="updates-timeline" *ngFor="let u of updates()">
              <div class="update-card">
                <div class="upd-date">{{ u.publishedAt | date:'mediumDate' }}</div>
                <h3>{{ u.title }}</h3>
                <p>{{ u.content }}</p>
              </div>
            </div>
          </article>

          <!-- Tab Content: Documents -->
          <article class="tab-pane" *ngIf="activeTab() === 'DOCS'">
            <div class="docs-grid">
              <div class="doc-item">
                <span class="doc-icon">📄</span>
                <div class="doc-info">
                  <h4>Hospital Treatment Estimate</h4>
                  <span class="verified-lbl">Verified by Verification Agent</span>
                </div>
              </div>
              <div class="doc-item">
                <span class="doc-icon">🪪</span>
                <div class="doc-info">
                  <h4>Beneficiary Identity Proof</h4>
                  <span class="verified-lbl">KYC Passed</span>
                </div>
              </div>
            </div>
          </article>
        </main>

        <!-- Sticky Donation Sidebar Right Column -->
        <aside class="sidebar-right">
          <div class="donation-card">
            <div class="progress-box">
              <div class="raised-line">
                <span class="amt">{{ campaign()!.currency }}{{ campaign()!.raisedAmount | number }}</span>
                <span class="goal">raised of {{ campaign()!.currency }}{{ campaign()!.targetGoalAmount | number }}</span>
              </div>

              <app-progress-bar [percentage]="percentageRaised"></app-progress-bar>

              <div class="donor-stats">
                <span><strong>{{ campaign()!.donorCount }}</strong> Donors</span>
                <span><strong>45</strong> Days Left</span>
              </div>
            </div>

            <button class="btn-donate-large" (click)="openDonationModal()">
              Donate Now
            </button>

            <div class="guarantee-note">
              <span>🔒 Guaranteed Safe & Transparent Settlement</span>
            </div>
          </div>
        </aside>
      </div>

      <!-- Donation Modal Overlay -->
      <div class="modal-backdrop" *ngIf="showModal()" (click)="closeDonationModal()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <button class="btn-close" (click)="closeDonationModal()">✕</button>

          <h2>Donate to {{ campaign()!.beneficiaryName }}</h2>
          <p class="modal-sub">Choose contribution amount</p>

          <div class="amount-presets">
            <button 
              *ngFor="let preset of presets" 
              [class.active]="selectedAmount() === preset"
              (click)="selectPreset(preset)">
              {{ campaign()!.currency }}{{ preset | number }}
            </button>
          </div>

          <div class="custom-amount">
            <label>Or enter custom amount ({{ campaign()!.currency }}):</label>
            <input type="number" [(ngModel)]="customAmount" (input)="onCustomInput()" min="10" />
          </div>

          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="isAnonymous" />
              <span>Make my donation anonymous on public leaderboard</span>
            </label>

            <label class="checkbox-label" *ngIf="campaign()!.taxBenefitAvailable">
              <input type="checkbox" [(ngModel)]="requestTaxBenefit" />
              <span>Request 80G Tax Benefit Certificate</span>
            </label>
          </div>

          <div class="pan-box" *ngIf="requestTaxBenefit">
            <label>PAN Number (Required for 80G):</label>
            <input type="text" [(ngModel)]="panNumber" placeholder="ABCDE1234F" />
          </div>

          <div class="modal-actions">
            <button class="btn-confirm-payment" [disabled]="processing()" (click)="processPayment()">
              {{ processing() ? 'Processing Payment...' : 'Proceed to Pay ' + campaign()!.currency + (selectedAmount() | number) }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loadingOrNotFound>
      <div class="loading-container">
        <p>Loading campaign details...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .details-page {
      background: #f8fafc;
      min-height: 100vh;
      padding: 40px 0 80px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .main-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 32px;
    }
    @media (max-width: 900px) {
      .main-layout { grid-template-columns: 1fr; }
    }
    .campaign-header {
      margin-bottom: 24px;
    }
    .category-tag {
      display: inline-block;
      background: #e0f2fe;
      color: #0369a1;
      font-size: 0.8rem;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }
    .title {
      font-size: 2rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.3;
      margin-bottom: 14px;
    }
    .meta-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
      font-size: 0.875rem;
      color: #64748b;
    }
    .tax-tag {
      color: #16a34a;
      font-weight: 600;
    }
    .cover-media {
      width: 100%;
      height: 420px;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 24px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    }
    .cover-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .trust-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-bottom: 30px;
    }
    .entity-box {
      display: flex;
      flex-direction: column;
    }
    .entity-box .lbl {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
    }
    .entity-box .val {
      font-size: 1rem;
      font-weight: 700;
      color: #0f172a;
    }
    .divider {
      width: 1px;
      height: 36px;
      background: #e2e8f0;
    }
    .details-tabs {
      display: flex;
      gap: 12px;
      border-bottom: 2px solid #e2e8f0;
      margin-bottom: 24px;
    }
    .details-tabs button {
      background: none;
      border: none;
      padding: 12px 20px;
      font-size: 1rem;
      font-weight: 700;
      color: #64748b;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
      transition: all 0.2s ease;
    }
    .details-tabs button.active {
      color: #0284c7;
      border-bottom-color: #0284c7;
    }
    .tab-pane {
      background: #ffffff;
      border-radius: 16px;
      padding: 32px;
      border: 1px solid #e2e8f0;
    }
    .story-content {
      line-height: 1.8;
      color: #334155;
      font-size: 1.05rem;
    }
    .updates-timeline {
      margin-bottom: 16px;
    }
    .update-card {
      background: #f8fafc;
      border-left: 4px solid #0284c7;
      padding: 16px 20px;
      border-radius: 8px;
    }
    .upd-date {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 600;
    }
    .docs-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .doc-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #f1f5f9;
      border-radius: 10px;
    }
    .doc-icon { font-size: 1.5rem; }
    .doc-info h4 { margin: 0; font-size: 0.95rem; color: #0f172a; }
    .verified-lbl { font-size: 0.75rem; color: #16a34a; font-weight: 600; }
    .sidebar-right {
      position: sticky;
      top: 30px;
    }
    .donation-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 10px 30px -5px rgba(0,0,0,0.08);
    }
    .raised-line {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
    }
    .raised-line .amt {
      font-size: 2rem;
      font-weight: 800;
      color: #0f172a;
    }
    .raised-line .goal {
      font-size: 0.875rem;
      color: #64748b;
    }
    .donor-stats {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      font-size: 0.9rem;
      color: #475569;
    }
    .btn-donate-large {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #16a34a, #15803d);
      color: #ffffff;
      font-size: 1.2rem;
      font-weight: 800;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      margin-top: 24px;
      box-shadow: 0 4px 14px rgba(22, 163, 74, 0.35);
      transition: transform 0.2s;
    }
    .btn-donate-large:hover {
      transform: translateY(-2px);
    }
    .guarantee-note {
      text-align: center;
      font-size: 0.8rem;
      color: #64748b;
      margin-top: 16px;
    }
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
      padding: 20px;
    }
    .modal-card {
      background: #ffffff;
      border-radius: 20px;
      max-width: 500px;
      width: 100%;
      padding: 32px;
      position: relative;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    .btn-close {
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: #94a3b8;
    }
    .modal-sub {
      color: #64748b;
      font-size: 0.9rem;
      margin-top: -8px;
      margin-bottom: 16px;
    }
    .amount-presets {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin: 20px 0;
    }
    .amount-presets button {
      padding: 12px 8px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      border-radius: 10px;
      font-weight: 700;
      color: #0f172a;
      cursor: pointer;
    }
    .amount-presets button.active {
      border-color: #0284c7;
      background: #e0f2fe;
      color: #0284c7;
    }
    .custom-amount label {
      font-size: 0.85rem;
      color: #475569;
      font-weight: 600;
    }
    .custom-amount input {
      width: 100%;
      padding: 12px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      font-size: 1rem;
      margin-top: 6px;
    }
    .checkbox-group {
      margin: 20px 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.875rem;
      color: #334155;
    }
    .pan-box {
      margin-bottom: 20px;
    }
    .pan-box label {
      font-size: 0.8rem;
      color: #475569;
      font-weight: 600;
    }
    .pan-box input {
      width: 100%;
      padding: 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      margin-top: 4px;
    }
    .btn-confirm-payment {
      width: 100%;
      padding: 14px;
      background: #0284c7;
      color: #ffffff;
      font-weight: 800;
      font-size: 1rem;
      border: none;
      border-radius: 10px;
      cursor: pointer;
    }
    .loading-container {
      text-align: center;
      padding: 100px 20px;
    }
  `]
})
export class CampaignDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private campaignService = inject(CampaignService);

  readonly campaign = signal<Campaign | undefined>(undefined);
  readonly updates = signal<CampaignUpdate[]>([]);
  readonly activeTab = signal<'STORY' | 'UPDATES' | 'DOCS'>('STORY');

  readonly showModal = signal<boolean>(false);
  readonly selectedAmount = signal<number>(500);
  readonly processing = signal<boolean>(false);

  readonly presets = [250, 500, 1000, 2500];
  customAmount: number = 500;
  isAnonymous: boolean = false;
  requestTaxBenefit: boolean = false;
  panNumber: string = '';

  get percentageRaised(): number {
    const c = this.campaign();
    if (!c || !c.targetGoalAmount) return 0;
    return (c.raisedAmount / c.targetGoalAmount) * 100;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || 'cg_1';
    this.campaignService.getCampaignById(id).subscribe(c => {
      this.campaign.set(c);
    });
    this.campaignService.getUpdatesForCampaign(id).subscribe(u => {
      this.updates.set(u);
    });
  }

  openDonationModal() {
    this.showModal.set(true);
  }

  closeDonationModal() {
    this.showModal.set(false);
  }

  selectPreset(amt: number) {
    this.selectedAmount.set(amt);
    this.customAmount = amt;
  }

  onCustomInput() {
    if (this.customAmount > 0) {
      this.selectedAmount.set(this.customAmount);
    }
  }

  processPayment() {
    const c = this.campaign();
    if (!c) return;

    this.processing.set(true);
    this.campaignService.recordDonation(c.id, this.selectedAmount(), this.isAnonymous).subscribe(() => {
      this.processing.set(false);
      this.closeDonationModal();
      this.campaignService.getCampaignById(c.id).subscribe(updated => {
        this.campaign.set(updated);
      });
    });
  }
}
