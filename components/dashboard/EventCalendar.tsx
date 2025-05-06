import React from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export default function EventCalendar({ events }: { events: any[] }) {
  // Extraire les dates des événements à venir (format yyyy-mm-dd)
  const eventDates = new Set(events.map(e => new Date(e.event_date).toISOString().split('T')[0]));

  return (
    <div className="w-full flex justify-center my-8">
      <Calendar
        tileClassName={({ date, view }) => {
          if (view === 'month') {
            const iso = date.toISOString().split('T')[0];
            if (eventDates.has(iso)) {
              return 'event-day-violet';
            }
          }
          return '';
        }}
        prev2Label={null}
        next2Label={null}
        calendarType="iso8601"
        className="event-calendar-custom"
      />
      <style jsx global>{`
        .event-calendar-custom {
          background: transparent !important;
          border: none !important;
          font-size: 1.35rem;
          width: 100%;
          max-width: 900px;
          box-shadow: none !important;
          padding: 0 0.5rem;
        }
        .event-calendar-custom .react-calendar__month-view__days {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr);
          gap: 1.2rem 1.2rem;
        }
        .event-calendar-custom .react-calendar__tile {
          min-height: 64px;
          min-width: 64px;
          font-size: 1.25rem;
          border-radius: 1.2rem;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
          background: transparent;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .event-calendar-custom .react-calendar__tile--now {
          background: #ede9fe !important;
          color: #7c3aed !important;
        }
        .event-calendar-custom .event-day-violet {
          background: #7c3aed !important;
          color: #fff !important;
          border-radius: 9999px !important;
          font-weight: bold;
          box-shadow: 0 2px 12px 0 #7c3aed33;
        }
        .event-calendar-custom .react-calendar__tile:enabled:hover,
        .event-calendar-custom .react-calendar__tile:enabled:focus {
          background: #a78bfa !important;
          color: #fff !important;
        }
        .event-calendar-custom .react-calendar__month-view__weekdays {
          background: transparent;
          font-size: 1.1rem;
          color: #c4b5fd;
        }
        .event-calendar-custom .react-calendar__navigation {
          background: transparent;
          margin-bottom: 1.5rem;
        }
        .event-calendar-custom .react-calendar__navigation button {
          background: none;
          color: #a78bfa;
          font-size: 1.5rem;
          min-width: 44px;
        }
        .event-calendar-custom abbr[title] {
          text-decoration: none;
        }
      `}</style>
    </div>
  );
} 