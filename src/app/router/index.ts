import { Routes } from '@angular/router';
export type AppRoutes = Routes & { name?: string; path: string }[];
const routes: AppRoutes = [
  {
    name: 'Trang chủ',
    path: '',
    loadComponent: () => import('./home'),
  },
  {
    path: 'post/:id',
    loadComponent: () => import('./post'),
  },
  {
    name: 'Phim hàn',
    path: 'k-drama',
    loadComponent: () => import('./post'),
  },
  {
    path: '**',
    loadComponent: () => import('@app/components/notfound'),
  },
];

export default routes;
