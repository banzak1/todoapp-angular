import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="empty-icon">{{ icon() }}</div>
      <h3 class="empty-title">{{ title() }}</h3>
      @if (message()) {
        <p class="empty-message">{{ message() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 3rem 1rem; text-align: center;
    }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
    .empty-title { font-size: 1.125rem; color: var(--color-text-primary); margin-bottom: 0.5rem; }
    .empty-message { color: var(--color-text-muted); font-size: 0.875rem; max-width: 400px; margin: 0; }
  `]
})
export class EmptyStateComponent {
  readonly icon = input('📋');
  readonly title = input('Nenhum item encontrado');
  readonly message = input<string>();
}
