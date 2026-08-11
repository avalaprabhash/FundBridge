import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { authGuard } from './core/guards/guard-guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/campaign-catalogue/campaign-catalogue').then(m => m.CampaignCatalogue)
      },
      {
        path: 'campaign/:id',
        loadComponent: () => import('./features/campaign-details/campaign-details').then(m => m.CampaignDetails)
      },
      { path: 'login', component: Login },
      { path: 'register', component: Register }
    ]
  },
  {
    path: 'donor',
    loadComponent: () => import('./features/donor/donor').then(m => m.Donor),
    canActivate: [authGuard]
  },
  {
    path: 'fundraiser',
    loadComponent: () => import('./features/fundraiser/fundraiser').then(m => m.Fundraiser),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
