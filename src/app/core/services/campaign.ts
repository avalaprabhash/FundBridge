import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Campaign, CategorySlug, CampaignUpdate, Donation, CampaignDocument } from '../models';

@Injectable({ providedIn: 'root' })
export class CampaignService {
  private readonly storageKey = 'fundbridge_campaigns';

  private mockCampaigns: Campaign[] = [
    {
      id: 'cg_1',
      campaignerId: 'usr_rahul',
      campaignerName: 'Rahul Sharma',
      beneficiaryId: 'ben_aarav',
      beneficiaryName: 'Aarav Sharma (Son, Age 6)',
      categoryId: 'MEDICAL',
      categoryName: 'Medical Treatment',
      title: 'Help 6-Year-Old Aarav Undergo Urgent Bone Marrow Transplant',
      slug: 'help-aarav-bone-marrow-transplant',
      tagline: 'Aarav is fighting acute leukemia. His doctor recommends an immediate transplant at Fortis Memorial Research Institute.',
      storyHtml: `<p>6-year-old Aarav was diagnosed with Acute Lymphoblastic Leukemia earlier this year. After rounds of intensive chemotherapy, his oncologists have advised an urgent Bone Marrow Transplant to save his life.</p><p>His father, Rahul, works as a school teacher and has exhausted all life savings on ongoing medical expenses. The total estimated cost of the transplant, ICU stay, and post-operative immunosuppressants is <strong>₹15,00,000</strong>.</p><p>We appeal to your generosity to give little Aarav a second chance at life.</p>`,
      coverImageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80',
      targetGoalAmount: 1500000,
      raisedAmount: 1125000,
      donorCount: 412,
      currency: '₹',
      startDate: '2026-07-01T00:00:00Z',
      endDate: '2026-09-30T00:00:00Z',
      state: 'LIVE',
      taxBenefitAvailable: true,
      taxBenefitType: '80G',
      isVerifiedBadge: true,
      location: 'New Delhi, India',
      createdAt: '2026-07-01T10:00:00Z'
    },
    {
      id: 'cg_2',
      campaignerId: 'usr_ngo_shiksha',
      campaignerName: 'Shiksha Foundation NGO',
      beneficiaryId: 'ben_shiksha_ngo',
      beneficiaryName: 'Shiksha Primary School Students',
      categoryId: 'NGO_NONPROFIT',
      categoryName: 'NGO & Social Cause',
      title: 'Provide Smart Digital Classrooms for 500 Rural Children',
      slug: 'smart-classrooms-for-rural-children',
      tagline: 'Bringing interactive tablets, digital projectors, and STEM learning modules to rural government schools in Rajasthan.',
      storyHtml: `<p>Over 500 children in remote villages near Udaipur lack basic access to modern educational tools. Shiksha Foundation is raising funds to equip 5 government schools with solar-powered digital smart classrooms.</p><p>Your contributions directly fund interactive tablets, offline educational software, and trained STEM instructors.</p>`,
      coverImageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
      targetGoalAmount: 500000,
      raisedAmount: 340000,
      donorCount: 185,
      currency: '₹',
      startDate: '2026-07-15T00:00:00Z',
      endDate: '2026-10-15T00:00:00Z',
      state: 'LIVE',
      taxBenefitAvailable: true,
      taxBenefitType: '80G',
      isVerifiedBadge: true,
      location: 'Udaipur, Rajasthan',
      createdAt: '2026-07-15T12:00:00Z'
    },
    {
      id: 'cg_3',
      campaignerId: 'usr_anita',
      campaignerName: 'Anita Menon',
      beneficiaryId: 'ben_kerala_flood',
      beneficiaryName: 'Wayanad Flood Relief Families',
      categoryId: 'EMERGENCY',
      categoryName: 'Emergency Relief',
      title: 'Emergency Flood Relief & Food Kits for Displaced Families',
      slug: 'emergency-flood-relief-wayanad',
      tagline: 'Providing immediate clean drinking water, emergency food kits, and medical supplies to 200 flood-affected families.',
      storyHtml: `<p>Severe flash floods have disrupted hundreds of lives in Wayanad district. Volunteer teams are on the ground distributing ration kits, tarpaulins, water purifiers, and hygiene products.</p><p>100% of proceeds go directly toward emergency procurement and field distribution.</p>`,
      coverImageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80',
      targetGoalAmount: 800000,
      raisedAmount: 680000,
      donorCount: 290,
      currency: '₹',
      startDate: '2026-08-01T00:00:00Z',
      endDate: '2026-09-15T00:00:00Z',
      state: 'LIVE',
      taxBenefitAvailable: false,
      isVerifiedBadge: true,
      location: 'Wayanad, Kerala',
      createdAt: '2026-08-01T08:00:00Z'
    },
    {
      id: 'cg_4',
      campaignerId: 'usr_meera',
      campaignerName: 'Meera Patel',
      beneficiaryId: 'ben_meera_self',
      beneficiaryName: 'Meera Patel (Self)',
      categoryId: 'EDUCATION',
      categoryName: 'Education',
      title: 'Help Meera Complete Her B.Tech Degree at IIT Bombay',
      slug: 'help-meera-iit-education',
      tagline: 'A bright daughter of a farmer needs financial support to pay her final year tuition fee and hostel accommodation.',
      storyHtml: `<p>Meera secured AIR 340 in JEE Advanced and earned a seat in Electrical Engineering at IIT Bombay. Due to recent crop failure, her family is unable to pay the final semester fee of ₹3,00,000.</p><p>Support Meera so financial hardship does not stop a talented young woman from becoming an engineer.</p>`,
      coverImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      targetGoalAmount: 300000,
      raisedAmount: 150000,
      donorCount: 76,
      currency: '₹',
      startDate: '2026-07-20T00:00:00Z',
      endDate: '2026-10-01T00:00:00Z',
      state: 'LIVE',
      taxBenefitAvailable: false,
      isVerifiedBadge: true,
      location: 'Mumbai, Maharashtra',
      createdAt: '2026-07-20T14:00:00Z'
    }
  ];

  private readonly campaignsSignal = signal<Campaign[]>(this.loadStoredCampaigns());

  readonly campaigns = this.campaignsSignal.asReadonly();

  private loadStoredCampaigns(): Campaign[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.mockCampaigns));
      return this.mockCampaigns;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return this.mockCampaigns;
    }
  }

  private saveCampaigns(campaigns: Campaign[]) {
    this.campaignsSignal.set(campaigns);
    localStorage.setItem(this.storageKey, JSON.stringify(campaigns));
  }

  getLiveCampaigns(): Observable<Campaign[]> {
    const live = this.campaignsSignal().filter(c => c.state === 'LIVE');
    return of(live).pipe(delay(150));
  }

  getCampaignById(id: string): Observable<Campaign | undefined> {
    const found = this.campaignsSignal().find(c => c.id === id);
    return of(found).pipe(delay(100));
  }

  createDraft(draft: Partial<Campaign>): Observable<Campaign> {
    const current = this.campaignsSignal();
    const newCampaign: Campaign = {
      id: 'cg_' + Date.now(),
      campaignerId: draft.campaignerId || 'usr_campaigner',
      campaignerName: draft.campaignerName || 'Anonymous Campaigner',
      beneficiaryId: 'ben_' + Date.now(),
      beneficiaryName: draft.beneficiaryName || 'Beneficiary Name',
      categoryId: draft.categoryId || 'MEDICAL',
      categoryName: draft.categoryName || 'Medical Treatment',
      title: draft.title || 'Untitled Campaign',
      slug: (draft.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: draft.tagline || '',
      storyHtml: draft.storyHtml || '<p>Campaign story details...</p>',
      coverImageUrl: draft.coverImageUrl || 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
      targetGoalAmount: draft.targetGoalAmount || 100000,
      raisedAmount: 0,
      donorCount: 0,
      currency: '₹',
      startDate: new Date().toISOString(),
      endDate: draft.endDate || new Date(Date.now() + 30 * 86400000).toISOString(),
      state: 'DRAFT',
      taxBenefitAvailable: draft.taxBenefitAvailable || false,
      isVerifiedBadge: false,
      location: draft.location || 'India',
      createdAt: new Date().toISOString()
    };

    const updated = [newCampaign, ...current];
    this.saveCampaigns(updated);
    return of(newCampaign).pipe(delay(200));
  }

  submitForVerification(campaignId: string): Observable<Campaign | undefined> {
    const current = [...this.campaignsSignal()];
    const index = current.findIndex(c => c.id === campaignId);
    if (index !== -1) {
      current[index] = { ...current[index], state: 'SUBMITTED' };
      this.saveCampaigns(current);
      return of(current[index]).pipe(delay(200));
    }
    return of(undefined);
  }

  recordDonation(campaignId: string, amount: number, isAnonymous: boolean): Observable<boolean> {
    const current = [...this.campaignsSignal()];
    const index = current.findIndex(c => c.id === campaignId);
    if (index !== -1) {
      const updated = {
        ...current[index],
        raisedAmount: current[index].raisedAmount + amount,
        donorCount: current[index].donorCount + 1
      };
      current[index] = updated;
      this.saveCampaigns(current);
      return of(true).pipe(delay(300));
    }
    return of(false);
  }

  getUpdatesForCampaign(campaignId: string): Observable<CampaignUpdate[]> {
    const mockUpdates: CampaignUpdate[] = [
      {
        id: 'upd_1',
        campaignId: 'cg_1',
        title: 'Chemotherapy Cycle #3 Completed Successfully',
        content: 'Aarav completed his third chemo cycle yesterday. Doctors report stable vitals, and we are preparing for pre-transplant tests. Thank you everyone for your support!',
        publishedAt: '2026-08-05T10:30:00Z'
      },
      {
        id: 'upd_2',
        campaignId: 'cg_1',
        title: 'Over 75% Goal Achieved!',
        content: 'We are overwhelmed by the kindness of 400+ donors. We are now ₹3.75 Lakhs away from the complete transplant budget.',
        publishedAt: '2026-08-10T16:00:00Z'
      }
    ];
    return of(mockUpdates.filter(u => u.campaignId === campaignId)).pipe(delay(100));
  }
}
