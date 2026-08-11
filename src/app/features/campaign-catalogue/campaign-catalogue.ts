import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CampaignService } from '../../core/services/campaign';
import { Campaign, CategorySlug } from '../../core/models';
import { CampaignCard } from '../../shared/components/campaign-card/campaign-card';

@Component({
  selector: 'app-campaign-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CampaignCard],
  template: `
    <div class="catalogue-page">
      <header class="hero-section">
        <div class="hero-content">
          <h1>Discover & Support Verified Fundraisers</h1>
          <p>Every contribution directly impacts patients, students, and social causes in need.</p>

          <div class="search-bar">
            <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
            <input 
              type="text" 
              placeholder="Search by patient name, cause, or keyword..."
              [ngModel]="searchQuery()" 
              (ngModelChange)="onSearchChange($event)" 
            />
          </div>
        </div>
      </header>

      <section class="container filter-bar">
        <div class="category-tabs">
          <button 
            *ngFor="let cat of categories" 
            class="tab-btn" 
            [class.active]="selectedCategory() === cat.slug"
            (click)="selectCategory(cat.slug)">
            {{ cat.name }}
          </button>
        </div>

        <div class="sort-wrapper">
          <label>Sort By:</label>
          <select [ngModel]="sortBy()" (ngModelChange)="onSortChange($event)">
            <option value="URGENT">Most Urgent</option>
            <option value="MOST_RAISED">Most Funded</option>
            <option value="NEWEST">Newly Added</option>
          </select>
        </div>
      </section>

      <main class="container grid-container">
        <div *ngIf="loading()" class="loading-state">
          <div class="spinner"></div>
          <p>Loading active campaigns...</p>
        </div>

        <div *ngIf="!loading() && filteredCampaigns().length === 0" class="empty-state">
          <p>No verified campaigns matched your criteria.</p>
          <button (click)="resetFilters()" class="btn-reset">Reset Filters</button>
        </div>

        <div class="campaign-grid" *ngIf="!loading() && filteredCampaigns().length > 0">
          <app-campaign-card 
            *ngFor="let c of filteredCampaigns()" 
            [campaign]="c">
          </app-campaign-card>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .catalogue-page {
      min-height: 100vh;
      background: #f8fafc;
      padding-bottom: 60px;
    }
    .hero-section {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      padding: 60px 20px;
      text-align: center;
    }
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }
    .hero-section h1 {
      font-size: 2.2rem;
      font-weight: 800;
      margin-bottom: 12px;
      letter-spacing: -0.02em;
    }
    .hero-section p {
      font-size: 1.1rem;
      color: #94a3b8;
      margin-bottom: 30px;
    }
    .search-bar {
      position: relative;
      max-width: 600px;
      margin: 0 auto;
    }
    .search-icon {
      position: absolute;
      left: 18px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: #94a3b8;
    }
    .search-bar input {
      width: 100%;
      padding: 16px 20px 16px 52px;
      border-radius: 9999px;
      border: 1px solid #334155;
      background: #1e293b;
      color: #ffffff;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .search-bar input:focus {
      border-color: #0284c7;
      box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.25);
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 30px auto;
      flex-wrap: wrap;
      gap: 16px;
    }
    .category-tabs {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .tab-btn {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #475569;
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }
    .tab-btn:hover {
      background: #f1f5f9;
    }
    .tab-btn.active {
      background: #0284c7;
      color: #ffffff;
      border-color: #0284c7;
    }
    .sort-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      color: #475569;
      font-weight: 600;
    }
    .sort-wrapper select {
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      font-weight: 600;
      color: #0f172a;
      outline: none;
    }
    .campaign-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }
    .loading-state, .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #64748b;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e2e8f0;
      border-top-color: #0284c7;
      border-radius: 50%;
      margin: 0 auto 16px;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .btn-reset {
      margin-top: 16px;
      padding: 8px 20px;
      background: #0284c7;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }
  `]
})
export class CampaignCatalogue implements OnInit {
  private campaignService = inject(CampaignService);

  readonly allCampaigns = signal<Campaign[]>([]);
  readonly loading = signal<boolean>(true);
  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<CategorySlug | 'ALL'>('ALL');
  readonly sortBy = signal<'URGENT' | 'MOST_RAISED' | 'NEWEST'>('URGENT');

  readonly categories: Array<{ name: string; slug: CategorySlug | 'ALL' }> = [
    { name: 'All Causes', slug: 'ALL' },
    { name: 'Medical', slug: 'MEDICAL' },
    { name: 'NGO & Social', slug: 'NGO_NONPROFIT' },
    { name: 'Emergency Relief', slug: 'EMERGENCY' },
    { name: 'Education', slug: 'EDUCATION' }
  ];

  readonly filteredCampaigns = computed(() => {
    let list = this.allCampaigns();
    const query = this.searchQuery().toLowerCase().trim();
    const category = this.selectedCategory();
    const sort = this.sortBy();

    if (category !== 'ALL') {
      list = list.filter(c => c.categoryId === category);
    }

    if (query) {
      list = list.filter(c =>
        c.title.toLowerCase().includes(query) ||
        c.beneficiaryName.toLowerCase().includes(query) ||
        c.tagline.toLowerCase().includes(query)
      );
    }

    return list.slice().sort((a, b) => {
      if (sort === 'MOST_RAISED') {
        return b.raisedAmount - a.raisedAmount;
      } else if (sort === 'NEWEST') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        const pctA = (a.raisedAmount / a.targetGoalAmount);
        const pctB = (b.raisedAmount / b.targetGoalAmount);
        return pctB - pctA;
      }
    });
  });

  ngOnInit() {
    this.campaignService.getLiveCampaigns().subscribe(data => {
      this.allCampaigns.set(data);
      this.loading.set(false);
    });
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
  }

  selectCategory(category: CategorySlug | 'ALL') {
    this.selectedCategory.set(category);
  }

  onSortChange(sort: 'URGENT' | 'MOST_RAISED' | 'NEWEST') {
    this.sortBy.set(sort);
  }

  resetFilters() {
    this.searchQuery.set('');
    this.selectedCategory.set('ALL');
    this.sortBy.set('URGENT');
  }
}
