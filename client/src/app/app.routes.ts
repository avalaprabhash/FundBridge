import { Routes } from '@angular/router';
import { Donor } from './features/donor/donor';
import { Fundraiser } from './features/fundraiser/fundraiser';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { authGuard } from './core/guards/guard-guard';

export const routes: Routes = [
    {
        path: '',
        component: PublicLayout,
        children: [
            {
                path: '',
                pathMatch: 'full',
                loadComponent: () => import('./features/landing/landing').then((m) => m.Landing),
            },
            { path: 'login', component: Login },
            { path: 'register', component: Register },
        ],
    },
    { path: 'donor', component: Donor },
    { path: 'fundraiser', component: Fundraiser, canActivate: [authGuard] },
];
