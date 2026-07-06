import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../../core/services/task.service';
import { AiSuggestService } from '../../../../core/services/ai-suggest.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, LoadingComponent, RouterLink],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
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
          this.router.navigate(['/', this.taskId]);
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
          this.router.navigate(['/', task.id]);
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
