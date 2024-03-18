import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'Home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'Login',
    loadComponent: () => import('./login-page/login-page.component').then((m) => m.LoingPageComponent),
  },
  {
    path: 'Registro',
    loadComponent: () => import('./register-page/register-page.component').then((m) => m.RegisterPageComponent),
  },
  {
    path: 'Perfil',
    loadComponent: () => import('./profile-page/profile-page.component').then((m) => m.ProfilePageComponent),
  },
  {
    path: '',
    redirectTo: 'Login',
    pathMatch: 'full',
  },
];
