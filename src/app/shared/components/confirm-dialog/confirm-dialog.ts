import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (isOpen()) {
      <div class="dialog-backdrop" (click)="cancel()">
        <div class="dialog" (click)="$event.stopPropagation()" role="alertdialog">
          <h3 class="dialog-title">{{ title() }}</h3>
          <p class="dialog-message">{{ message() }}</p>
          <div class="dialog-actions">
            <button class="btn btn-secondary" (click)="cancel()">Cancelar</button>
            <button class="btn btn-danger" (click)="confirm()">{{ confirmText() }}</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .dialog-backdrop {
      position: fixed; inset: 0; background: rgba(15,23,42,0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; animation: fadeIn 0.15s ease;
    }
    .dialog {
      background: var(--color-surface); border-radius: var(--radius-lg);
      padding: var(--spacing-xl); max-width: 400px; width: 90%;
      box-shadow: var(--shadow-lg); animation: fadeIn 0.2s ease;
    }
    .dialog-title { font-size: 1.125rem; margin-bottom: 0.5rem; }
    .dialog-message { color: var(--color-text-secondary); font-size: 0.875rem; margin-bottom: 1.5rem; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 0.75rem; }
  `]
})
export class ConfirmDialogComponent {
  readonly isOpen = signal(false);
  title = signal('Confirmar');
  message = signal('Tem certeza?');
  confirmText = signal('Confirmar');

  private resolveFn?: (value: boolean) => void;

  show(data: { title?: string; message?: string; confirmText?: string }): Promise<boolean> {
    if (data.title) this.title.set(data.title);
    if (data.message) this.message.set(data.message);
    if (data.confirmText) this.confirmText.set(data.confirmText);
    this.isOpen.set(true);
    return new Promise(resolve => { this.resolveFn = resolve; });
  }

  confirm(): void {
    this.isOpen.set(false);
    this.resolveFn?.(true);
  }

  cancel(): void {
    this.isOpen.set(false);
    this.resolveFn?.(false);
  }
}
