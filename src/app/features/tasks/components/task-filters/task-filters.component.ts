import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskStatus, TaskPriority } from '../../../../models/task.model';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-filters.component.html',
  styleUrl: './task-filters.component.scss'
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
