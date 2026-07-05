import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe, DatePipe } from '@angular/common';
import { Task } from '../../../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [RouterLink, SlicePipe, DatePipe],
  template: `
    <article class="task-card" [style.borderLeftColor]="priorityColor()">
      <div class="task-card-body">
        <div class="task-card-top">
          <span class="badge badge-{{ task().status.toLowerCase() }}">
            {{ statusLabel() }}
          </span>
          <span class="badge badge-{{ task().priority.toLowerCase() }}">
            {{ task().priority }}
          </span>
        </div>
        <a [routerLink]="['/tasks', task().id]" class="task-title">{{ task().title }}</a>
        @if (task().description) {
          <p class="task-description">{{ task().description | slice:0:120 }}{{ task().description.length > 120 ? '...' : '' }}</p>
        }
        <div class="task-card-footer">
          <span class="task-date">{{ task().createdAt | date:'dd/MM/yyyy' }}</span>
          <div class="task-actions">
            <button class="btn btn-ghost btn-sm" (click)="edit.emit(task())" title="Editar">✎</button>
            <button class="btn btn-ghost btn-sm btn-delete" (click)="delete.emit(task())" title="Deletar">✕</button>
          </div>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .task-card {
      background: var(--color-surface); border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      border-left: 4px solid var(--color-border);
      transition: all var(--transition-fast);
      overflow: hidden;
    }
    .task-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
    .task-card-body { padding: var(--spacing-lg); }
    .task-card-top { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
    .task-title {
      display: block; font-weight: 600; font-size: 1rem;
      color: var(--color-text-primary); margin-bottom: 0.5rem;
      text-decoration: none;
    }
    .task-title:hover { color: var(--color-primary); }
    .task-description {
      color: var(--color-text-secondary); font-size: 0.875rem;
      margin-bottom: 1rem; line-height: 1.5;
    }
    .task-card-footer {
      display: flex; align-items: center; justify-content: space-between;
      padding-top: 0.75rem; border-top: 1px solid var(--color-border-light);
    }
    .task-date { font-size: 0.8125rem; color: var(--color-text-muted); }
    .task-actions { display: flex; gap: 0.25rem; }
    .btn-delete:hover { color: var(--color-error) !important; }
  `]
})
export class TaskCardComponent {
  readonly task = input.required<Task>();
  readonly edit = output<Task>();
  readonly delete = output<Task>();

  statusLabel(): string {
    const labels: Record<string, string> = { TODO: 'A Fazer', IN_PROGRESS: 'Em Andamento', DONE: 'Concluído' };
    return labels[this.task().status] || this.task().status;
  }

  priorityColor(): string {
    const colors: Record<string, string> = {
      LOW: 'var(--color-priority-low)',
      MEDIUM: 'var(--color-priority-medium)',
      HIGH: 'var(--color-priority-high)'
    };
    return colors[this.task().priority] || 'var(--color-border)';
  }
}
