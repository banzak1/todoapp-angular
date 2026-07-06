import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/tasks/tasks.routes').then(m => m.TASK_ROUTES)
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 - todoApp'
  }
];
