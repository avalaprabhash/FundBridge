import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DonorLayout } from '../../layouts/donor-layout/donor-layout';
import { Campaign, CampaignData } from '../../core/services/campaigns/campaign';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-donor',
  standalone: true,
  imports: [DonorLayout, CommonModule, FormsModule],
  templateUrl: './donor.html',
  styleUrl: './donor.css',
})
export class Donor implements OnInit {
  allCamps: CampaignData[] = [];
  loading = false;
  selectedCampaign: CampaignData | null = null;
  donationAmount: number = 1000;
  donating = false;
  toastMessage = '';

  constructor(
    public campServ: Campaign,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.loading = true;
    this.cdr.markForCheck();

    this.campServ.getCampaigns().subscribe({
      next: (camps) => {
        this.allCamps = Array.isArray(camps) ? camps : [];
        this.loading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load campaigns from API:', err);
        // Fallback to service campaigns array if available
        if (this.campServ.campaigns.length > 0) {
          this.allCamps = this.campServ.campaigns;
        }
        this.loading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  openDonateModal(camp: CampaignData): void {
    this.selectedCampaign = camp;
    this.donationAmount = 1000;
    this.cdr.markForCheck();
  }

  closeDonateModal(): void {
    this.selectedCampaign = null;
    this.cdr.markForCheck();
  }

  confirmDonate(): void {
    if (!this.selectedCampaign || !this.selectedCampaign.id || this.donationAmount <= 0) return;

    this.donating = true;
    const campId = this.selectedCampaign.id;
    this.cdr.markForCheck();

    this.campServ.donate(campId, this.donationAmount).subscribe({
      next: (res) => {
        this.donating = false;
        if (res && res.success && res.campaign) {
          const idx = this.allCamps.findIndex(c => c.id == campId);
          if (idx !== -1) {
            this.allCamps[idx] = res.campaign;
          }
          this.showToast(`Thank you! Successfully donated ₹${this.donationAmount} to "${res.campaign.title}".`);
        }
        this.closeDonateModal();
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.donating = false;
        alert(err.error?.message || 'Donation failed. Please try again.');
        this.cdr.markForCheck();
      }
    });
  }

  showToast(msg: string) {
    this.toastMessage = msg;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.toastMessage = '';
      this.cdr.markForCheck();
    }, 4000);
  }
}
