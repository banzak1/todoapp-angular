import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="loading-overlay">
      <div class="spinner" [class.spinner-sm]="small()"></div>
      @if (message()) {
        <p class="loading-message">{{ message() }}</p>
      }
    </div>
  `,
  styles: [`
    .loading-overlay {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 3rem 1rem; gap: 1rem;
    }
    .loading-message { color: var(--color-text-muted); font-size: 0.875rem; margin: 0; }
  `]
})
export class LoadingComponent {
  readonly message = input<string>();
  readonly small = input(false);
}
