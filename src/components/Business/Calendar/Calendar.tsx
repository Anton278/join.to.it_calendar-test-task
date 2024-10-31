import { useState } from "react";
import { createPortal } from "react-dom";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // Month view
import timeGridPlugin from "@fullcalendar/timegrid"; // Week/Day view
import interactionPlugin from "@fullcalendar/interaction"; // Allows interaction like clicks
import type { DateClickArg } from "@fullcalendar/interaction";
import type { EventClickArg, EventDropArg } from "@fullcalendar/core";

import { useEventsStore } from "@/stores/events";
import renderEventContent from "./utils/renderEventContent";
import EventPopover from "@/components/Business/EventPopover/EventPopover";
import type { Event } from "@/models/event";

import "react-datepicker/dist/react-datepicker.css";
import "./Calendar.css";

function Calendar() {
  const eventsStore = useEventsStore();
  console.log("events: ", eventsStore.events);

  const [showEventPopover, setShowEventPopover] = useState(false);
  const [eventPopoverAnchor, setEventPopoverAnchor] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [selectedEvent, setSelectedEvent] = useState<Event>({
    title: "",
    start: new Date(),
    id: "",
    notes: "",
  });

  const handleCloseEventPopover = () => {
    setShowEventPopover(false);
    setEventPopoverAnchor({ x: 0, y: 0 });
  };

  const handleDateClick = (info: DateClickArg) => {
    console.log("dateClick: ", info);

    setSelectedEvent({ title: "", id: "", start: info.date, notes: "" });
    setEventPopoverAnchor({
      x: info.jsEvent.pageX,
      y: info.jsEvent.pageY,
    });
    setShowEventPopover(true);
  };

  const handleEventClick = (selectedEvent: EventClickArg) => {
    console.log("event click: ", selectedEvent);

    const event = eventsStore.events.find(
      (event) => event.id === selectedEvent.event.id
    );
    if (!event) {
      return;
    }

    setSelectedEvent(event);
    setEventPopoverAnchor({
      x: selectedEvent.jsEvent.pageX,
      y: selectedEvent.jsEvent.pageY,
    });
    setShowEventPopover(true);
  };

  const handleEventDrop = (eventDropInfo: EventDropArg) => {
    console.log("eventDropInfo: ", eventDropInfo);

    const event = eventsStore.events.find(
      (event) => event.id === eventDropInfo.event.id
    );
    if (!event || !eventDropInfo.event.start) {
      return;
    }

    eventsStore.updateEvent(event.id, {
      ...event,
      start: eventDropInfo.event.start,
    });
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          start: "today,prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="dayGridMonth"
        eventBackgroundColor="#3B86FF"
        slotDuration="02:00:00"
        slotLabelInterval="02:00"
        height="auto"
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
        }}
        editable
        eventDisplay="block"
        weekends={false}
        events={eventsStore.events}
        eventContent={renderEventContent}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
      />
      {createPortal(
        <EventPopover
          open={showEventPopover}
          anchor={eventPopoverAnchor}
          selectedEvent={selectedEvent}
          onClose={handleCloseEventPopover}
        />,
        document.body
      )}
    </>
  );
}

export default Calendar;
