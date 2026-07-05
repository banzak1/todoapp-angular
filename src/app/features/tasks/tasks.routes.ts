import { Routes } from '@angular/router';

export const TASK_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/task-list/task-list.component').then(m => m.TaskListPage),
    title: 'Tarefas - todoApp'
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/task-form/task-form.component').then(m => m.TaskFormPage),
    title: 'Nova Tarefa - todoApp'
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/task-detail/task-detail.component').then(m => m.TaskDetailPage),
    title: 'Detalhes - todoApp'
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/task-form/task-form.component').then(m => m.TaskFormPage),
    title: 'Editar Tarefa - todoApp'
  }
];
