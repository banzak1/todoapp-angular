import { Component, inject, OnInit, signal, computed, DestroyRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../../../core/services/task.service';
import { Task, TaskListParams, TaskStatus } from '../../../../models/task.model';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { TaskFiltersComponent } from '../../components/task-filters/task-filters.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    RouterLink, TaskCardComponent, TaskFiltersComponent, PaginationComponent,
    LoadingComponent, EmptyStateComponent, ConfirmDialogComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListPage implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly confirmDialog = viewChild.required<ConfirmDialogComponent>('confirmDialog');

  readonly tasks = signal<Task[]>([]);
  readonly updatingTasks = signal<Set<number>>(new Set());
  readonly highPriorityTasks = computed(() => this.tasks().filter(t => t.priority === 'HIGH'));
  readonly mediumPriorityTasks = computed(() => this.tasks().filter(t => t.priority === 'MEDIUM'));
  readonly lowPriorityTasks = computed(() => this.tasks().filter(t => t.priority === 'LOW'));

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
    this.router.navigate(['/', task.id, 'edit']);
  }

  onStatusChange(event: { task: Task; status: TaskStatus }): void {
    const { task, status } = event;
    const previousStatus = task.status;

    if (this.updatingTasks().has(task.id)) return;

    this.updatingTasks.update(set => {
      const newSet = new Set(set);
      newSet.add(task.id);
      return newSet;
    });

    this.tasks.update(tasks =>
      tasks.map(t => t.id === task.id ? { ...t, status } : t)
    );

    this.taskService.updateTask(task.id, { status }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (updatedTask) => {
        this.tasks.update(tasks =>
          tasks.map(t => t.id === task.id ? updatedTask : t)
        );
        this.updatingTasks.update(set => {
          const newSet = new Set(set);
          newSet.delete(task.id);
          return newSet;
        });
        this.toast.success('Status da tarefa atualizado com sucesso!');
      },
      error: () => {
        this.tasks.update(tasks =>
          tasks.map(t => t.id === task.id ? { ...t, status: previousStatus } : t)
        );
        this.updatingTasks.update(set => {
          const newSet = new Set(set);
          newSet.delete(task.id);
          return newSet;
        });
        this.toast.error('Erro ao atualizar o status da tarefa.');
      }
    });
  }

  async onDelete(task: Task): Promise<void> {
    const confirmed = await this.confirmDialog().show({
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
