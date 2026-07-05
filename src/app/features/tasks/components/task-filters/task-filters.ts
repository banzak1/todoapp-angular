import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskStatus, TaskPriority } from '../../../../models/task.model';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="filters">
      <select class="filter-select" [ngModel]="status()" (ngModelChange)="onStatusChange($event)">
        <option value="">Todos Status</option>
        <option value="TODO">A Fazer</option>
        <option value="IN_PROGRESS">Em Andamento</option>
        <option value="DONE">Concluído</option>
      </select>

      <select class="filter-select" [ngModel]="priority()" (ngModelChange)="onPriorityChange($event)">
        <option value="">Todas Prioridades</option>
        <option value="LOW">Baixa</option>
        <option value="MEDIUM">Média</option>
        <option value="HIGH">Alta</option>
      </select>

      @if (hasActiveFilters()) {
        <button class="btn btn-ghost btn-sm" (click)="clearFilters()">Limpar filtros ✕</button>
      }
    </div>
  `,
  styles: [`
    .filters { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
    .filter-select {
      padding: 8px 12px; border: 1px solid var(--color-border);
      border-radius: var(--radius-sm); font-family: var(--font-sans);
      font-size: 0.875rem; color: var(--color-text-primary);
      background: var(--color-surface); cursor: pointer; outline: none;
    }
    .filter-select:focus { border-color: var(--color-primary); }
  `]
})
export class TaskFiltersComponent {
  readonly status = signal<string>('');
  readonly priority = signal<string>('');
  readonly filterChange = output<{ status?: string; priority?: string }>();

  hasActiveFilters(): boolean { return !!this.status() || !!this.priority(); }

  onStatusChange(value: string): void {
    this.status.set(value);
    this.emitChange();
  }

  onPriorityChange(value: string): void {
    this.priority.set(value);
    this.emitChange();
  }

  clearFilters(): void {
    this.status.set('');
    this.priority.set('');
    this.emitChange();
  }

  private emitChange(): void {
    this.filterChange.emit({
      status: this.status() || undefined,
      priority: this.priority() || undefined
    });
  }
}
