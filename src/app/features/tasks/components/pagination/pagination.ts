import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    @if (totalPages() > 1) {
      <div class="pagination">
        <button class="btn btn-secondary btn-sm" [disabled]="currentPage() === 0" (click)="goToPage(currentPage() - 1)">
          ← Anterior
        </button>

        <div class="page-numbers">
          @for (page of visiblePages(); track page) {
            <button class="page-btn" [class.active]="page === currentPage()" (click)="goToPage(page)">
              {{ page + 1 }}
            </button>
          }
        </div>

        <button class="btn btn-secondary btn-sm" [disabled]="currentPage() >= totalPages() - 1" (click)="goToPage(currentPage() + 1)">
          Próxima →
        </button>
      </div>
    }
  `,
  styles: [`
    .pagination {
      display: flex; align-items: center; justify-content: center;
      gap: 0.5rem; padding: 1.5rem 0;
    }
    .page-numbers { display: flex; gap: 0.25rem; }
    .page-btn {
      width: 36px; height: 36px; border-radius: var(--radius-sm);
      border: 1px solid var(--color-border); background: var(--color-surface);
      color: var(--color-text-secondary); font-size: 0.875rem;
      cursor: pointer; transition: all var(--transition-fast);
    }
    .page-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
    .page-btn.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
  `]
})
export class PaginationComponent {
  readonly currentPage = input(0);
  readonly totalPages = input(1);
  readonly pageChange = output<number>();

  visiblePages(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    const start = Math.max(0, current - 2);
    const end = Math.min(total, current + 3);

    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.pageChange.emit(page);
    }
  }
}
