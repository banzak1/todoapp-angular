import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page">
      <div class="container">
        <div class="not-found">
          <div class="not-found-code">404</div>
          <h1 class="not-found-title">Página não encontrada</h1>
          <p class="not-found-message">A página que você procura não existe ou foi removida.</p>
          <a routerLink="/" class="btn btn-primary">Voltar para o início</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found { text-align: center; padding: 4rem 1rem; }
    .not-found-code { font-size: 6rem; font-weight: 700; color: var(--color-primary); line-height: 1; margin-bottom: 1rem; }
    .not-found-title { font-size: 1.5rem; margin-bottom: 0.75rem; }
    .not-found-message { color: var(--color-text-secondary); margin-bottom: 2rem; }
  `]
})
export class NotFoundComponent {}
