import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TaskService } from '../../../../core/services/task.service';
import { Task } from '../../../../models/task.model';
import { LoadingComponent } from '../../../../shared/components/loading/loading';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { ToastService } from '../../../../shared/components/toast/toast.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, LoadingComponent, EmptyStateComponent, ConfirmDialogComponent],
  template: `
    <div class="page">
      <div class="container" style="max-width: 720px;">
        <div class="page-header">
          <h1 class="page-title">Detalhes da Tarefa</h1>
          <a routerLink="/" class="btn btn-ghost">← Voltar</a>
        </div>

        @if (loading()) {
          <app-loading message="Carregando tarefa..." />
        } @else if (notFound()) {
          <app-empty-state icon="🔍" title="Tarefa não encontrada" message="Esta tarefa pode ter sido removida ou não existe.">
            <a routerLink="/" class="btn btn-primary mt-md">Voltar para lista</a>
          </app-empty-state>
        } @else if (task(); as t) {
          <div class="detail-card">
            <div class="detail-header">
              <h2 class="detail-title">{{ t.title }}</h2>
              <div class="detail-badges">
                <span class="badge badge-{{ t.status.toLowerCase() }}">{{ statusLabel(t.status) }}</span>
                <span class="badge badge-{{ t.priority.toLowerCase() }}">{{ t.priority }}</span>
              </div>
            </div>

            @if (t.description) {
              <div class="detail-section">
                <h3>Descrição</h3>
                <p class="detail-description">{{ t.description }}</p>
              </div>
            }

            <div class="detail-meta">
              <div class="meta-item">
                <span class="meta-label">Criada em</span>
                <span class="meta-value">{{ t.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Atualizada em</span>
                <span class="meta-value">{{ t.updatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
            </div>

            <div class="detail-actions">
              <a [routerLink]="['/tasks', t.id, 'edit']" class="btn btn-primary">Editar</a>
              <button class="btn btn-danger" (click)="onDelete(t)">Deletar</button>
            </div>
          </div>
        }
      </div>
    </div>

    <app-confirm-dialog #confirmDialog />
  `,
  styles: [`
    .detail-card {
      background: var(--color-surface); border-radius: var(--radius-lg);
      border: 1px solid var(--color-border); padding: var(--spacing-xl);
    }
    .detail-header { margin-bottom: 1.5rem; }
    .detail-title { font-size: 1.5rem; margin-bottom: 0.75rem; }
    .detail-badges { display: flex; gap: 0.5rem; }
    .detail-section { margin-bottom: 1.5rem; }
    .detail-section h3 { font-size: 0.875rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
    .detail-description { color: var(--color-text-secondary); line-height: 1.7; font-size: 0.9375rem; }
    .detail-meta { display: flex; gap: 2rem; padding: 1.25rem 0; border-top: 1px solid var(--color-border-light); margin-bottom: 1.5rem; }
    .meta-item { display: flex; flex-direction: column; gap: 0.25rem; }
    .meta-label { font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .meta-value { font-size: 0.875rem; color: var(--color-text-primary); }
    .detail-actions { display: flex; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid var(--color-border-light); }
  `]
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
