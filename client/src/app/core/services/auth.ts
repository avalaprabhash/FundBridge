import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Auth {
    private readonly apiUrl = 'http://localhost:5000/api/auth';
    private readonly loggedInKey = 'fundbridge.loggedIn';
    private readonly tokenKey = 'fundbridge.token';
    private readonly userKey = 'fundbridge.user';

    constructor(private http: HttpClient) { }

    public isLoggedIn(): boolean {
        return localStorage.getItem(this.loggedInKey) === 'true';
    }

    public getUser(): any {
        const raw = localStorage.getItem(this.userKey);
        return raw ? JSON.parse(raw) : null;
    }

    login(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
            tap(res => {
                if (res && res.success) {
                    localStorage.setItem(this.loggedInKey, 'true');
                    if (res.token) localStorage.setItem(this.tokenKey, res.token);
                    if (res.user) localStorage.setItem(this.userKey, JSON.stringify(res.user));
                }
            })
        );
    }

    register(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register`, data).pipe(
            tap(res => {
                if (res && res.success) {
                    localStorage.setItem(this.loggedInKey, 'true');
                    if (res.token) localStorage.setItem(this.tokenKey, res.token);
                    if (res.user) localStorage.setItem(this.userKey, JSON.stringify(res.user));
                }
            })
        );
    }

    logout() {
        localStorage.removeItem(this.loggedInKey);
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
    }
}
