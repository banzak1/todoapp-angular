import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TaskCardComponent } from './task-card.component';
import { Task } from '../../../../models/task.model';
import { By } from '@angular/platform-browser';

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    priority: 'HIGH',
    status: 'TODO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    
    fixture.componentRef.setInput('task', mockTask);
    fixture.componentRef.setInput('disabled', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render task title', () => {
    const titleEl = fixture.debugElement.query(By.css('a')).nativeElement;
    expect(titleEl.textContent).toContain('Test Task');
  });

  it('should have checkbox status matching task status (not DONE => unchecked)', () => {
    const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]')).nativeElement as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('should have checkbox checked when status is DONE', () => {
    fixture.componentRef.setInput('task', { ...mockTask, status: 'DONE' });
    fixture.detectChanges();
    const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]')).nativeElement as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('should emit statusChange with DONE when checked', () => {
    let emitted: any = null;
    component.statusChange.subscribe(val => emitted = val);

    const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]')).nativeElement;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    expect(emitted).toEqual({ task: mockTask, status: 'DONE' });
  });

  it('should emit statusChange with TODO when unchecked', () => {
    fixture.componentRef.setInput('task', { ...mockTask, status: 'DONE' });
    fixture.detectChanges();

    let emitted: any = null;
    component.statusChange.subscribe(val => emitted = val);

    const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]')).nativeElement;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));

    expect(emitted).toEqual({ task: { ...mockTask, status: 'DONE' }, status: 'TODO' });
  });

  it('should respect disabled state on checkbox', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]')).nativeElement as HTMLInputElement;
    expect(checkbox.disabled).toBe(true);
  });

  it('should apply opacity-60 and pointer-events-none class when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const cardContainer = fixture.debugElement.query(By.css('.group')).nativeElement as HTMLElement;
    expect(cardContainer.classList.contains('opacity-60')).toBe(true);
    expect(cardContainer.classList.contains('pointer-events-none')).toBe(true);
  });
});
