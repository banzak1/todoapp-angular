import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TaskService } from '../../../../core/services/task.service';
import { Task } from '../../../../models/task.model';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, LoadingComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailPage implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly confirmDialog = inject(ConfirmDialogComponent);

  readonly task = signal<Task | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTask(id);
  }

  private loadTask(id: number): void {
    this.taskService.getTask(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (task) => {
        this.task.set(task);
        this.loading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      }
    });
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = { TODO: 'A Fazer', IN_PROGRESS: 'Em Andamento', DONE: 'Concluído' };
    return labels[status] || status;
  }

  async onDelete(t: Task): Promise<void> {
    const confirmed = await this.confirmDialog.show({
      title: 'Deletar tarefa',
      message: `Tem certeza que deseja deletar "${t.title}"?`,
      confirmText: 'Deletar'
    });

    if (confirmed) {
      this.taskService.deleteTask(t.id).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: () => {
          this.toast.success('Tarefa deletada!');
          this.router.navigate(['/']);
        }
      });
    }
  }
}
