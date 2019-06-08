import {ChangeDetectionStrategy, Component, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {addDays, addHours, endOfMonth, isSameDay, isSameMonth, setHours, setMinutes, startOfDay, subDays} from 'date-fns';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarDateFormatter,
  CalendarDayViewBeforeRenderEvent,
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent, CalendarMonthViewBeforeRenderEvent,
  CalendarView, CalendarWeekViewBeforeRenderEvent
} from 'angular-calendar';
import {CustomDateFormatter} from './custom-date-formatter.provider';

const colors: any = {
  red: {
    primary: '#af2323',
    secondary: '#fae6e6'
  },
  blue: {
    primary: '#1e91ff',
    secondary: '#d2e6ff'
  },
  yellow: {
    primary: '#e6be0a',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['styles.css'],
  templateUrl: 'template.html',
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ]
})
export class DemoComponent {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [

    // {
    //   start: startOfDay(new Date()),
    //   title: 'An event with no end date',
    //   color: colors.yellow,
    //   actions: this.actions
    // },
    // {
    //   start: subDays(endOfMonth(new Date()), 3),
    //   end: addDays(endOfMonth(new Date()), 3),
    //   title: 'A long event that spans 2 months',
    //   color: colors.blue,
    //   allDay: true
    // },
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   end: new Date(),
    //   title: 'A draggable and resizable event',
    //   color: colors.yellow,
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // }
  ];

  activeDayIsOpen = true;
  clickedDate: Date;

  constructor(private modal: NgbModal) {}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;

      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'Slub',
        start: addHours(startOfDay(new Date()), 7),
        end: setHours(setMinutes(new Date(), 0), 15),
        color: colors.red,
        draggable: true,
        actions: this.actions,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    renderEvent.body.forEach(day => {
      const dayOfMonth = day.date.getDate();
      if (dayOfMonth >= 1 && dayOfMonth < 4 && day.inMonth) {
        day.cssClass = 'bg-red';
      }
    });
  }

  beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent) {
    renderEvent.hourColumns.forEach(hourColumn => {
      hourColumn.hours.forEach(hour => {
        hour.segments.forEach(segment => {
          if (
            segment.date.getHours() >= 10 &&
            segment.date.getHours() <= 12 &&
            segment.date.getDay() === 2
          ) {
            segment.cssClass = 'bg-red';
          }
        });
      });
    });
  }

  beforeDayViewRender(renderEvent: CalendarDayViewBeforeRenderEvent) {
    renderEvent.body.hourGrid.forEach(hour => {
      hour.segments.forEach((segment, index) => {
        if (segment.date.getHours() >= 10 && segment.date.getHours() <= 12) {
          segment.cssClass = 'bg-red';
        }
      });
    });
  }
}
