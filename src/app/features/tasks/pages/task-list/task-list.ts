import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../../../core/services/task.service';
import { Task, TaskListParams } from '../../../../models/task.model';
import { TaskCardComponent } from '../../components/task-card/task-card';
import { TaskFiltersComponent } from '../../components/task-filters/task-filters';
import { PaginationComponent } from '../../components/pagination/pagination';
import { LoadingComponent } from '../../../../shared/components/loading/loading';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { ToastService } from '../../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    RouterLink, TaskCardComponent, TaskFiltersComponent, PaginationComponent,
    LoadingComponent, EmptyStateComponent, ConfirmDialogComponent
  ],
  template: `
    <div class="page">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">Tarefas</h1>
          <a routerLink="/new" class="btn btn-primary">+ Nova Tarefa</a>
        </div>

        <app-task-filters (filterChange)="onFilterChange($event)" />

        @if (loading()) {
          <app-loading message="Carregando tarefas..." />
        } @else if (error()) {
          <app-empty-state icon="⚠️" title="Erro ao carregar" message="Não foi possível carregar as tarefas.">
            <button class="btn btn-primary mt-md" (click)="loadTasks()">Tentar novamente</button>
          </app-empty-state>
        } @else if (tasks().length === 0) {
          <app-empty-state icon="📋" title="Nenhuma tarefa" message="Você ainda não tem tarefas. Crie sua primeira tarefa!">
            <a routerLink="/new" class="btn btn-primary mt-md">Criar Tarefa</a>
          </app-empty-state>
        } @else {
          <div class="task-grid">
            @for (task of tasks(); track task.id) {
              <app-task-card
                [task]="task"
                (edit)="onEdit($event)"
                (delete)="onDelete($event)"
              />
            }
          </div>

          <app-pagination
            [currentPage]="currentPage()"
            [totalPages]="totalPages()"
            (pageChange)="onPageChange($event)"
          />
        }
      </div>
    </div>

    <app-confirm-dialog #confirmDialog />
  `,
  styles: [`
    .task-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1rem; margin-top: 1.5rem;
    }
    @media (max-width: 768px) {
      .task-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class TaskListPage implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly confirmDialog = inject(ConfirmDialogComponent);

  readonly tasks = signal<Task[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly currentPage = signal(0);
  readonly totalPages = signal(0);

  private filters: { status?: string; priority?: string } = {};

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading.set(true);
    this.error.set(false);

    const params: TaskListParams = {
      page: this.currentPage(),
      size: 20
    };
    if (this.filters.status) params.status = this.filters.status as TaskListParams['status'];
    if (this.filters.priority) params.priority = this.filters.priority as TaskListParams['priority'];

    this.taskService.getTasks(params).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (page) => {
        this.tasks.set(page.content);
        this.totalPages.set(page.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  onFilterChange(filters: { status?: string; priority?: string }): void {
    this.filters = filters;
    this.currentPage.set(0);
    this.loadTasks();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadTasks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onEdit(task: Task): void {
    this.router.navigate(['/tasks', task.id, 'edit']);
  }

  async onDelete(task: Task): Promise<void> {
    const confirmed = await this.confirmDialog.show({
      title: 'Deletar tarefa',
      message: `Tem certeza que deseja deletar "${task.title}"?`,
      confirmText: 'Deletar'
    });

    if (confirmed) {
      this.taskService.deleteTask(task.id).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: () => {
          this.toast.success('Tarefa deletada com sucesso!');
          this.loadTasks();
        }
      });
    }
  }
}
