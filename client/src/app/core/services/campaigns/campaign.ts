import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface CampaignData {
    id?: string | number;
    title: string;
    description: string;
    targetAmount: number;
    collectedAmount: number;
    daysLeft: number;
    image: string;
}

@Injectable({ providedIn: 'root' })
export class Campaign {
    private readonly apiUrl = 'http://localhost:5000/api/campaigns';
    public campaigns: CampaignData[] = [];

    constructor(private http: HttpClient) { }

    getCampaigns(): Observable<CampaignData[]> {
        return this.http.get<CampaignData[]>(this.apiUrl).pipe(
            tap(camps => {
                this.campaigns = Array.isArray(camps) ? camps : [];
            })
        );
    }

    getCampaignById(id: string | number): Observable<CampaignData> {
        return this.http.get<CampaignData>(`${this.apiUrl}/${id}`);
    }

    addCamps(camp: any): Observable<CampaignData> {
        return this.http.post<CampaignData>(this.apiUrl, camp).pipe(
            tap(newCamp => {
                if (newCamp) {
                    this.campaigns.push(newCamp);
                }
            })
        );
    }

    donate(id: string | number, amount: number, donorName?: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${id}/donate`, { amount, donorName }).pipe(
            tap(res => {
                if (res && res.success && res.campaign) {
                    const idx = this.campaigns.findIndex(c => c.id == id);
                    if (idx !== -1) {
                        this.campaigns[idx] = res.campaign;
                    }
                }
            })
        );
    }
}
