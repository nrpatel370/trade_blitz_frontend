import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'player-rankings',
    loadComponent: () => import('./features/player-rankings/player-rankings.component').then(m => m.PlayerRankingsComponent)
  },
  {
    path: 'trade-analyzer',
    loadComponent: () => import('./features/trade-analyzer/trade-analyzer.component').then(m => m.TradeAnalyzerComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];