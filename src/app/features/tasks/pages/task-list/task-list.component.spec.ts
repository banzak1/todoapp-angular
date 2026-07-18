import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TaskListPage } from './task-list.component';
import { TaskService } from '../../../../core/services/task.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { of, throwError } from 'rxjs';
import { Task, Page } from '../../../../models/task.model';
import { By } from '@angular/platform-browser';

describe('TaskListPage', () => {
  let component: TaskListPage;
  let fixture: ComponentFixture<TaskListPage>;
  let mockTaskService: any;
  let mockToastService: any;

  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Desc 1',
      priority: 'HIGH',
      status: 'TODO',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Desc 2',
      priority: 'LOW',
      status: 'DONE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const mockPage: Page<Task> = {
    content: mockTasks,
    totalPages: 1,
    totalElements: 2,
    size: 20,
    number: 0,
    first: true,
    last: true,
    empty: false
  };

  beforeEach(async () => {
    mockTaskService = {
      getTasks: vi.fn().mockReturnValue(of(mockPage)),
      updateTask: vi.fn(),
      deleteTask: vi.fn()
    };

    mockToastService = {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TaskListPage],
      providers: [
        provideRouter([]),
        { provide: TaskService, useValue: mockTaskService },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    expect(mockTaskService.getTasks).toHaveBeenCalled();
    expect(component.tasks()).toEqual(mockTasks);
  });

  it('should update task status via TaskService.updateTask and keep other properties intact', () => {
    const updatedTask: Task = { ...mockTasks[0], status: 'DONE' };
    mockTaskService.updateTask.mockReturnValue(of(updatedTask));

    component.onStatusChange({ task: mockTasks[0], status: 'DONE' });

    expect(mockTaskService.updateTask).toHaveBeenCalledWith(1, { status: 'DONE' });
    expect(component.tasks()[0]).toEqual(updatedTask);
    expect(component.tasks()[1]).toEqual(mockTasks[1]);
    expect(mockToastService.success).toHaveBeenCalledWith('Status da tarefa atualizado com sucesso!');
  });

  it('should restore previous status and show toast on API error', () => {
    mockTaskService.updateTask.mockReturnValue(throwError(() => new Error('API Error')));

    component.onStatusChange({ task: mockTasks[0], status: 'DONE' });

    expect(component.tasks()[0].status).toBe('TODO');
    expect(mockToastService.error).toHaveBeenCalledWith('Erro ao atualizar o status da tarefa.');
  });

  it('should not render search elements or notification elements', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const searchBar = compiled.querySelector('input[placeholder="Search tasks..."]');
    expect(searchBar).toBeNull();

    const searchIcons = compiled.querySelectorAll('.material-symbols-outlined');
    const searchIconTexts = Array.from(searchIcons).map(icon => icon.textContent?.trim());
    expect(searchIconTexts).not.toContain('search');
    expect(searchIconTexts).not.toContain('notifications');
  });

  it('should not render side calendar and quick stats widgets', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const calendarWidget = compiled.querySelector('app-calendar-widget');
    expect(calendarWidget).toBeNull();

    const quickStatsTitle = Array.from(compiled.querySelectorAll('h3')).find(
      h3 => h3.textContent?.trim() === 'Quick Stats'
    );
    expect(quickStatsTitle).toBeUndefined();
  });
});
