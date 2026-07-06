import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Task, CreateTaskRequest, UpdateTaskRequest, TaskListParams, Page
} from '../../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tasks`;

  getTasks(params?: TaskListParams): Observable<Page<Task>> {
    const MOCK_TASKS: Task[] = [
      { id: 1, title: 'Implementar Header', description: 'Criar o layout do header responsivo.', priority: 'HIGH', status: 'IN_PROGRESS', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 2, title: 'Revisar PR do Backend', description: 'Revisar as rotas de paginação da API REST.', priority: 'MEDIUM', status: 'TODO', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 3, title: 'Atualizar documentação', description: '', priority: 'LOW', status: 'DONE', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 4, title: 'Configurar testes E2E', description: 'Instalar Cypress e criar testes básicos.', priority: 'MEDIUM', status: 'TODO', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 5, title: 'Ajustar variáveis de cor', description: 'Adicionar novas cores para badges no SCSS.', priority: 'LOW', status: 'IN_PROGRESS', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];
    const page: Page<Task> = {
      content: MOCK_TASKS,
      totalPages: 1,
      totalElements: MOCK_TASKS.length,
      size: 20,
      number: 0,
      first: true,
      last: true,
      empty: false
    };
    return of(page).pipe(delay(500));
  }

  getTask(id: number): Observable<Task> {
    const task: Task = { id, title: 'Tarefa Mockada', description: 'Detalhes da tarefa...', priority: 'MEDIUM', status: 'TODO', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    return of(task).pipe(delay(300));
  }

  createTask(data: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, data);
  }

  updateTask(id: number, data: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, data);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
