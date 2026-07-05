import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
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
