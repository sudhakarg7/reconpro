// Angular modules
import { Routes } from '@angular/router';

export const routes : Routes = [
  {
    path         : 'auth',
    loadChildren : () => import('./pages/auth/auth.routes').then(m => m.routes),
  },
  {
    path          : 'home',
    loadComponent : () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path          : 'client-config',
    loadComponent : () => import('./pages/clientconfig/clientconfig.component').then(m => m.ClientconfigComponent),
  },
  {
    path          : 'create-profile',
    loadComponent : () => import('./pages/create-profile/create-profile.component').then(m => m.CreateProfileComponent),
  },
  {
    path          : 'view-profile',
    loadComponent : () => import('./pages/view-profile/view-profile.component').then(m => m.ViewProfileComponent),
  },
  {
    path          : 'recon-reports',
    loadComponent : () => import('./pages/recon-report/recon-report.component').then(m => m.ReconReportComponent),
  },
  {
    path          : 'recon-config',
    loadComponent : () => import('./pages/recon-config/recon-config.component').then(m => m.ReconConfigComponent),
  },
  {
    path          : 'upload-files',
    loadComponent : () => import('./pages/upload-files/upload-files.component').then(m => m.UploadFilesComponent),
  },
  {
    path          : 'chat',
    loadComponent : () => import('./pages/chatai/chatai.component').then(m => m.ChataiComponent),
  },
  { path : '', redirectTo : '/auth', pathMatch : 'full' },
  {
    path          : '**',
    loadComponent : () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];