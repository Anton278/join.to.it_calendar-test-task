import type { Event } from "@/models/event";

type EventsState = {
  events: Event[];
};
type EventsActions = {
  addEvent: (event: AddEventPayload) => void;
  updateEvent: (eventId: string, newEvent: Event) => void;
  removeEvent: (eventId: string) => void;
};

export type EventsStore = EventsState & EventsActions;

export type AddEventPayload = {
  title: string;
  start: Date;
  notes: string;
};
