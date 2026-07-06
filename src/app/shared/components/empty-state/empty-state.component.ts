import { Component, input, computed, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly icon = input('—');
  readonly iconSvg = input<string>();
  readonly title = input('Nenhum item encontrado');
  readonly message = input<string>();

  readonly safeSvg = computed<SafeHtml | null>(() => {
    const svg = this.iconSvg();
    return svg ? this.sanitizer.bypassSecurityTrustHtml(svg) : null;
  });
}
