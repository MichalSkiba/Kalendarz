import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  CalendarDatePipe,
  CalendarDayViewComponent,
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewComponent,
  CalendarNextViewDirective,
  CalendarPreviousViewDirective,
  CalendarTodayDirective,
  CalendarView,
  CalendarWeekViewComponent,
  DateAdapter,
  provideCalendar
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@Component({
  selector: 'mwl-demo-component',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CalendarDatePipe,
    CalendarPreviousViewDirective, CalendarTodayDirective, CalendarNextViewDirective,
    CalendarMonthViewComponent, CalendarWeekViewComponent, CalendarDayViewComponent
  ],
  providers: [provideCalendar({provide: DateAdapter, useFactory: adapterFactory})],
  templateUrl: './template.html',
  styleUrl: './styles.css'
})
export class DemoComponent {
  readonly CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;
  viewDate = new Date();
  activeDayIsOpen = false;
  readonly refresh = new Subject<void>();
  events: CalendarEvent[] = [];
  private nextId = 1;

  setView(view: CalendarView): void { this.view = view; }
  closeOpenMonthViewDay(): void { this.activeDayIsOpen = false; }
  today(): void { this.viewDate = new Date(); }

  dayClicked(date: Date): void {
    this.viewDate = date;
    this.activeDayIsOpen = !this.activeDayIsOpen;
  }

  eventTimesChanged(change: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(event =>
      event === change.event ? {...event, start: change.newStart, end: change.newEnd} : event
    );
    this.refresh.next();
  }

  addEvent(): void {
    const start = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), this.viewDate.getDate(), 10);
    this.events = [...this.events, {
      id: this.nextId++,
      title: 'Nowe wydarzenie',
      start,
      end: new Date(start.getTime() + 60 * 60 * 1000),
      color: {primary:'#1874ba',secondary:'#dcefff'},
      draggable: true,
      resizable: {beforeStart: true, afterEnd: true}
    }];
    this.refresh.next();
  }

  removeEvent(event: CalendarEvent): void {
    this.events = this.events.filter(item => item !== event);
    this.refresh.next();
  }

  updateStart(event: CalendarEvent, inputEvent: Event): void {
    const value = (inputEvent.target as HTMLInputElement).value;
    if (!value) { return; }
    const start = new Date(value);
    if (!Number.isNaN(start.getTime())) {
      this.events = this.events.map(item => item === event ? {...item,start} : item);
      this.refresh.next();
    }
  }

  toLocalDateTime(date: Date): string {
    const pad = (n: number) => String(n).padStart(2,'0');
    return date.getFullYear() + '-' + pad(date.getMonth()+1) + '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) + ':' + pad(date.getMinutes());
  }
}
