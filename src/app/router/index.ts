import { Routes } from '@angular/router';
export type AppRoutes = Routes & { name?: string; path: string }[];
const routes: AppRoutes = [
  {
    name: 'Trang chủ',
    path: '',
    data: {
      navigationId: 287,
    },
    pathMatch: 'full',
    loadComponent: () => import('@app/pages/home'),
  },
  {
    name: 'Phim hàn',
    path: 'k-drama',
    data: {
      navigationId: 294,
    },
    loadComponent: () => import('@app/pages/home'),
  },
  {
    name: 'Phim chiếu rạp',
    path: 'movie',
    loadComponent: () => import('@app/pages/movie/movie-outlet'),
    children: [
      {
        path: '',
        data: {
          navigationId: 335,
        },
        loadComponent: () => import('@app/pages/home'),
      },
      {
        path: ':id',
        loadComponent: () => import('@app/pages/movie'),
      },
    ],
  },
  {
    name: 'Anime',
    path: 'anime',
    data: {
      navigationId: 362,
    },
    loadComponent: () => import('@app/pages/home'),
  },
  {
    path: 'album',
    loadComponent: () => import('@app/pages/album'),
  },
  {
    path: 'post/:id',
    loadComponent: () => import('@app/pages/post'),
  },
  {
    path: '**',
    loadComponent: () => import('@app/components/notfound'),
  },
];

export default routes;
