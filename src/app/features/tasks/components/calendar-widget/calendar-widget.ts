import { Component, input, computed } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Task } from '../../../../models/task.model';

@Component({
  selector: 'app-calendar-widget',
  standalone: true,
  imports: [NgClass, DatePipe],
  templateUrl: './calendar-widget.html',
  styleUrl: './calendar-widget.scss',
})
export class CalendarWidget {
  readonly tasks = input<Task[]>([]);

  readonly currentDate = new Date();
  readonly monthName = this.currentDate.toLocaleString('en-US', { month: 'long' });
  readonly year = this.currentDate.getFullYear();
  readonly weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  readonly days = computed(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const calendarDays: { day: number | null, hasTask: boolean, isToday: boolean }[] = [];
    
    for (let i = 0; i < startingDay; i++) {
      calendarDays.push({ day: null, hasTask: false, isToday: false });
    }
    
    const today = new Date();
    const tasksList = this.tasks();
    
    const taskDates = new Set(
      tasksList
        .filter(t => {
           const d = new Date(t.createdAt);
           return d.getFullYear() === year && d.getMonth() === month;
        })
        .map(t => new Date(t.createdAt).getDate())
    );
    
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = today.getDate() === i && today.getMonth() === month && today.getFullYear() === year;
      calendarDays.push({
        day: i,
        hasTask: taskDates.has(i),
        isToday: isToday
      });
    }
    
    return calendarDays;
  });
}
