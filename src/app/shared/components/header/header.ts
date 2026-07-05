import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="header">
      <div class="container header-content">
        <a routerLink="/" class="logo">
          <span class="logo-icon">✓</span>
          <span class="logo-text">todoApp</span>
        </a>
        <nav class="nav">
          <a routerLink="/" class="nav-link">Tarefas</a>
          <a routerLink="/new" class="btn btn-primary btn-sm">+ Nova Tarefa</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: sticky; top: 0; z-index: 100;
      background: rgba(255,255,255,0.9); backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--color-border);
      height: var(--header-height);
    }
    .header-content { display: flex; align-items: center; justify-content: space-between; height: 100%; }
    .logo { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; }
    .logo-icon {
      width: 32px; height: 32px; background: var(--color-primary);
      color: #fff; border-radius: 8px; display: flex; align-items: center;
      justify-content: center; font-weight: 700; font-size: 1rem;
    }
    .logo-text { font-weight: 700; font-size: 1.125rem; color: var(--color-text-primary); }
    .nav { display: flex; align-items: center; gap: 1rem; }
    .nav-link { color: var(--color-text-secondary); font-size: 0.875rem; font-weight: 500; }
    .nav-link:hover { color: var(--color-text-primary); }
  `]
})
export class HeaderComponent {}
