import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

import type { EventsStore } from "./types";

const useEventsStore = create<EventsStore>()((set, get) => ({
  events: [],
  /* */
  addEvent: (event) => {
    const events = get().events;
    set({ events: [...events, { ...event, id: uuidv4() }] });
  },
  updateEvent: (eventId, newEvent) => {
    const oldEvents = get().events;
    const newEvents = oldEvents.map((event) =>
      event.id === eventId ? newEvent : event
    );
    set({ events: newEvents });
  },
  removeEvent: (eventId) => {
    const events = get().events;
    set({ events: events.filter((event) => event.id !== eventId) });
  },
}));

export { useEventsStore };
