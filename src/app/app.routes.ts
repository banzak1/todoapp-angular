import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    /* webpackChunkName: "tasks" */
    loadChildren: () => import('./features/tasks/tasks.routes').then(m => m.TASK_ROUTES)
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found').then(m => m.NotFoundComponent),
    title: '404 - todoApp'
  }
];
