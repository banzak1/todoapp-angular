import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  readonly icon = input('📋');
  readonly title = input('Nenhum item encontrado');
  readonly message = input<string>();
}
