import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Auth {
    private readonly loggedInKey = 'fundbridge.loggedIn';

    isLoggedIn(): boolean {
        return localStorage.getItem(this.loggedInKey) === 'true';
    }

    login(data: any) {
        const isValid = data.email == 'admin@g' && data.password == 'admin';

        if (isValid) {
            localStorage.setItem(this.loggedInKey, 'true');
        }

        return isValid;
    }

    register(data: any) {
        console.log('Auth Register called');
        console.log(data);
        localStorage.setItem(this.loggedInKey, 'true');
        return true;
    }

    logout() {
        localStorage.removeItem(this.loggedInKey);
    }
}
