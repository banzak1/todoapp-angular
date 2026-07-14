import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Task, CreateTaskRequest, UpdateTaskRequest, TaskListParams, Page
} from '../../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tasks`;

  getTasks(params?: TaskListParams): Observable<Page<Task>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page !== undefined) httpParams = httpParams.set('page', params.page);
      if (params.size !== undefined) httpParams = httpParams.set('size', params.size);
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.priority) httpParams = httpParams.set('priority', params.priority);
      if (params.sort) httpParams = httpParams.set('sort', params.sort);
    }
    return this.http.get<Page<Task>>(`${this.baseUrl}/page`, { params: httpParams });
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
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
