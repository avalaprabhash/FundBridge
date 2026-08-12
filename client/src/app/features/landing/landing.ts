import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Campaign, CampaignData } from '../../core/services/campaigns/campaign';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit {
  featuredCampaigns: CampaignData[] = [];
  loading = true;

  constructor(
    public campServ: Campaign,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.campServ.getCampaigns().subscribe({
      next: (camps) => {
        if (Array.isArray(camps)) {
          this.featuredCampaigns = camps.slice(0, 6);
        }
        this.loading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: () => {
        if (this.campServ.campaigns.length > 0) {
          this.featuredCampaigns = this.campServ.campaigns.slice(0, 6);
        }
        this.loading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }
}
