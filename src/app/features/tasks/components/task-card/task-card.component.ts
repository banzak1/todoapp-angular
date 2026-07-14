import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe, DatePipe, NgClass } from '@angular/common';
import { Task } from '../../../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [RouterLink, SlicePipe, DatePipe, NgClass],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
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
