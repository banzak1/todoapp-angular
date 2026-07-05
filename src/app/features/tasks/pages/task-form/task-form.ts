import { Component, inject, OnInit, signal, DestroyRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../../core/services/task.service';
import { AiSuggestService } from '../../../../core/services/ai-suggest.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, LoadingComponent, RouterLink],
  template: `
    <div class="page">
      <div class="container" style="max-width: 640px;">
        <div class="page-header">
          <h1 class="page-title">{{ isEditing() ? 'Editar Tarefa' : 'Nova Tarefa' }}</h1>
          <a routerLink="/" class="btn btn-ghost">← Voltar</a>
        </div>

        @if (loadingTask()) {
          <app-loading message="Carregando tarefa..." />
        } @else {
          <form (ngSubmit)="onSubmit()" class="form">
            <div class="form-group">
              <label class="form-label" for="title">Título *</label>
              <input id="title" name="title" [(ngModel)]="formData.title" #titleCtrl="ngModel"
                     class="input" placeholder="Digite o título da tarefa" required
                     [class.input-error]="titleCtrl.invalid && titleCtrl.touched" />
              @if (titleCtrl.invalid && titleCtrl.touched) {
                <span class="form-error">Título é obrigatório</span>
              }
            </div>

            <div class="form-group">
              <label class="form-label" for="description">Descrição</label>
              <textarea id="description" name="description" [(ngModel)]="formData.description"
                        class="textarea" placeholder="Digite a descrição (opcional)" rows="4"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="priority">Prioridade</label>
                <select id="priority" name="priority" [(ngModel)]="formData.priority" class="select">
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Média</option>
                  <option value="HIGH">Alta</option>
                </select>
              </div>

              @if (isEditing()) {
                <div class="form-group">
                  <label class="form-label" for="status">Status</label>
                  <select id="status" name="status" [(ngModel)]="formData.status" class="select">
                    <option value="TODO">A Fazer</option>
                    <option value="IN_PROGRESS">Em Andamento</option>
                    <option value="DONE">Concluído</option>
                  </select>
                </div>
              }
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="onAiSuggest()"
                      [disabled]="suggesting()" title="Sugerir com IA">
                @if (suggesting()) {
                  <span class="spinner spinner-sm"></span>
                } @else {
                  ✨
                }
                Sugerir com IA
              </button>

              <div class="form-actions-right">
                <a routerLink="/" class="btn btn-ghost">Cancelar</a>
                <button type="submit" class="btn btn-primary" [disabled]="formData.title.trim() === '' || submitting()">
                  {{ submitting() ? 'Salvando...' : (isEditing() ? 'Salvar' : 'Criar Tarefa') }}
                </button>
              </div>
            </div>
          </form>
        }
      </div>
    </div>
  `,
  styles: [`
    .form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
    .form-label { font-size: 0.875rem; font-weight: 500; color: var(--color-text-primary); }
    .form-error { font-size: 0.8125rem; color: var(--color-error); }
    .input-error { border-color: var(--color-error) !important; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    @media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }
    .form-actions { display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid var(--color-border); }
    .form-actions-right { display: flex; gap: 0.75rem; }
  `]
})
export class TaskFormPage implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly aiService = inject(AiSuggestService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isEditing = signal(false);
  readonly loadingTask = signal(false);
  readonly submitting = signal(false);
  readonly suggesting = signal(false);
  private taskId?: number;

  formData = {
    title: '',
    description: '',
    priority: 'MEDIUM' as string,
    status: 'TODO' as string
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskId = Number(id);
      this.isEditing.set(true);
      this.loadTask();
    }
  }

  private loadTask(): void {
    if (!this.taskId) return;
    this.loadingTask.set(true);
    this.taskService.getTask(this.taskId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (task) => {
        this.formData = {
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status
        };
        this.loadingTask.set(false);
      },
      error: () => {
        this.toast.error('Tarefa não encontrada');
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit(): void {
    if (this.formData.title.trim() === '') return;
    this.submitting.set(true);

    if (this.isEditing() && this.taskId) {
      this.taskService.updateTask(this.taskId, {
        title: this.formData.title.trim(),
        description: this.formData.description || undefined,
        priority: this.formData.priority as any,
        status: this.formData.status as any
      }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.toast.success('Tarefa atualizada!');
          this.router.navigate(['/tasks', this.taskId]);
        },
        error: () => this.submitting.set(false)
      });
    } else {
      this.taskService.createTask({
        title: this.formData.title.trim(),
        description: this.formData.description || undefined,
        priority: this.formData.priority as any
      }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (task) => {
          this.toast.success('Tarefa criada!');
          this.router.navigate(['/tasks', task.id]);
        },
        error: () => this.submitting.set(false)
      });
    }
  }

  onAiSuggest(): void {
    if (!this.formData.title.trim()) {
      this.toast.info('Digite um título primeiro');
      return;
    }
    this.suggesting.set(true);

    this.aiService.suggest({
      title: this.formData.title,
      description: this.formData.description
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (suggestion) => {
        this.formData.priority = suggestion.suggestedPriority;
        if (suggestion.refinedDescription) {
          this.formData.description = suggestion.refinedDescription;
        }
        if (suggestion.suggestedSubtasks?.length) {
          this.toast.info(`${suggestion.suggestedSubtasks.length} subtarefas sugeridas!`);
        }
        this.suggesting.set(false);
      },
      error: () => {
        this.toast.error('IA temporariamente indisponível');
        this.suggesting.set(false);
      }
    });
  }
}
