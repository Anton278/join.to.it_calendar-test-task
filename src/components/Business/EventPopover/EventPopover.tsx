import { useRef, useEffect, useId } from "react";
import DatePicker from "react-datepicker";
import { useFormik } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";

import type { Event } from "@/models/event";
import type { AddEventPayload } from "@/stores/events/types";
import { useEventsStore } from "@/stores/events";

import s from "./EventPopover.module.scss";

type EventPopoverProps = {
  open: boolean;
  anchor: { x: number; y: number };
  selectedEvent: Event;
  onClose?: () => void;
};

type EventFormValues = {
  name: string;
  date: Date;
  time: Date;
  notes: string;
};

function EventPopover({
  open,
  anchor,
  selectedEvent,
  onClose,
}: EventPopoverProps) {
  const eventsStore = useEventsStore();
  const id = useId();
  const popoverRef = useRef<HTMLDivElement>(null);

  const isSelectedEventExist = selectedEvent.id && selectedEvent.title;

  const initialValues: EventFormValues = {
    name: "",
    date: new Date(),
    time: new Date(),
    notes: "",
  };
  const onSubmit = (
    values: EventFormValues,
    { resetForm }: FormikHelpers<EventFormValues>
  ) => {
    let combinedDateTime = values.date;
    combinedDateTime.setHours(values.time.getHours());
    combinedDateTime.setMinutes(values.time.getMinutes());

    onClose && onClose();

    const isSelectedEventNotExist = !selectedEvent.id && !selectedEvent.title;
    if (isSelectedEventNotExist) {
      const event: AddEventPayload = {
        title: values.name,
        start: combinedDateTime,
        notes: values.notes,
      };
      eventsStore.addEvent(event);
      return;
    }

    eventsStore.updateEvent(selectedEvent.id, {
      ...selectedEvent,
      title: values.name,
      start: combinedDateTime,
    });

    resetForm();
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema: Yup.object({
      name: Yup.string().required("Field is required"),
    }),
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const onClick = (e: MouseEvent) => {
      if (
        !popoverRef?.current?.contains(e.target as Node) &&
        open &&
        // @ts-ignore
        !e.target?.closest(".react-datepicker")
      ) {
        onClose && onClose();
      }
    };

    if (open) {
      timeoutId = setTimeout(() => {
        document.addEventListener("click", onClick);
      }, 0);
    } else {
      document.removeEventListener("click", onClick);
    }

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", onClick);
    };
  }, [open, popoverRef]);

  useEffect(() => {
    formik.setTouched({});
    formik.setErrors({});
    formik.setFieldValue("name", selectedEvent.title);
    formik.setFieldValue("date", selectedEvent.start);
    formik.setFieldValue("time", selectedEvent.start);
    formik.setFieldValue("notes", selectedEvent.notes);
  }, [selectedEvent]);

  const handleCancelClick = () => {
    onClose && onClose();

    if (isSelectedEventExist) {
      eventsStore.removeEvent(selectedEvent.id);
    }
  };

  return (
    <div
      className={`${s.eventPopover} ${open && s.eventPopoverVisible}`}
      style={{ top: anchor.y, left: anchor.x }}
      ref={popoverRef}
    >
      <button className={s.popoverCloseButton} onClick={onClose}>
        X
      </button>
      <div className={s.popoverBody}>
        <form onSubmit={formik.handleSubmit} id={`${id}-form`}>
          <div className={s.popoverField}>
            <label htmlFor={`${id}-event-name`}>event name</label>
            <input
              type="text"
              id={`${id}-event-name`}
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && !!formik.errors.name && (
              <p className={s.popoverFieldError}>{formik.errors.name}</p>
            )}
          </div>
          <div className={s.popoverField}>
            <label htmlFor={`${id}-event-date`}>event date</label>
            <DatePicker
              selected={formik.values.date}
              onChange={(date) => formik.setFieldValue("date", date)}
              id={`${id}-event-date`}
              name="date"
            />
          </div>
          <div className={s.popoverField}>
            <label htmlFor={`${id}-event-time`}>event time</label>
            <DatePicker
              selected={formik.values.time}
              onChange={(date) => formik.setFieldValue("time", date)}
              id={`${id}-event-time`}
              showTimeSelect
              showTimeSelectOnly
              timeFormat="HH:mm"
              dateFormat="HH:mm"
              name="time"
            />
          </div>
          <div className={s.popoverField}>
            <label htmlFor={`${id}-event-notes`}>notes</label>
            <input
              type="text"
              id={`${id}-event-notes`}
              {...formik.getFieldProps("notes")}
            />
            {formik.touched.notes && !!formik.errors.notes && (
              <p>{formik.errors.notes}</p>
            )}
          </div>
        </form>
      </div>
      <div className={s.popoverFooter}>
        <button
          className={s.popoverFooterButtonCancel}
          onClick={handleCancelClick}
        >
          {isSelectedEventExist ? "Discard" : "Cancel"}
        </button>
        <button
          className={s.popoverFooterButtonSave}
          type="submit"
          form={`${id}-form`}
        >
          {isSelectedEventExist ? "Edit" : "Save"}
        </button>
      </div>
    </div>
  );
}

export default EventPopover;
