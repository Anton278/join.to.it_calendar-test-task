import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { Formik, Form, Field, useFormik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // Month view
import timeGridPlugin from "@fullcalendar/timegrid"; // Week/Day view
import interactionPlugin from "@fullcalendar/interaction"; // Allows interaction like clicks
import DatePicker from "react-datepicker";

import { ReactComponent as HomeIcon } from "@/assets/icons/home.svg";
import { ReactComponent as MailIcon } from "@/assets/icons/mail.svg";
import { ReactComponent as InvoicesIcon } from "@/assets/icons/invoices.svg";
import { ReactComponent as HelpCenterIcon } from "@/assets/icons/help-center.svg";
import { ReactComponent as GearIcon } from "@/assets/icons/gear.svg";

import { ReactComponent as WebIcon } from "@/assets/icons/web.svg";

import { ReactComponent as ArrowDownIcon } from "@/assets/icons/arrow-down.svg";
import johnDoeImage from "@/assets/images/john_doe.png";

import s from "./App.module.scss";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [anchor, setAnchor] = useState<any>({});
  const id = useId();
  const [events, setEvents] = useState<any>([
    { title: "Meeting", start: new Date(), id: uuidv4() },
  ]);
  const [showPopover, setShowPopover] = useState(false);
  const [eventId, setEventId] = useState("");

  useEffect(() => {
    const onClick = (e: any) => {
      console.log("click: ", e);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  const formik = useFormik({
    initialValues: { name: "", date: null, time: null, notes: "" },
    onSubmit: (values, { resetForm }) => {
      let combinedDateTime = values.date;
      // @ts-ignore
      combinedDateTime.setHours(values.time.getHours());
      // @ts-ignore
      combinedDateTime.setMinutes(values.time.getMinutes());

      setShowPopover(false);

      if (!eventId) {
        setEvents([
          ...events,
          { title: values.name, start: combinedDateTime, id: uuidv4() },
        ]);
      } else {
        setEvents(
          // @ts-ignore
          events.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  title: values.name,
                  start: combinedDateTime,
                }
              : event
          )
        );
      }

      resetForm();
      setAnchor({});
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Field is required"),
    }),
  });

  return (
    <>
      <main className={s.wrapper}>
        <aside className={s.aside}>
          <h2 className={s.asideHeader}>Impekable</h2>
          <ul className={s.navLinksList}>
            <li className={s.navLinkItem}>
              <a href="#">
                <HomeIcon /> Home
              </a>
            </li>
            <li className={s.navLinkItem}>
              <a href="#">Dashboard</a>
            </li>
            <li className={s.navLinkItem}>
              <a href="#">
                <MailIcon /> MailIcon
              </a>
            </li>
            <li className={s.navLinkItem}>
              <a href="#">Products</a>
            </li>
            <li className={s.navLinkItem}>
              <a href="#">
                <InvoicesIcon /> Invoices
              </a>
            </li>
            <li className={s.navLinkItem}>
              <a href="#">Customers</a>
            </li>
            <li className={s.navLinkItem}>
              <a href="#">Chat Room</a>
            </li>
            <li className={s.navLinkItem}>
              <a href="#">Calendar</a>
            </li>
            <li className={s.navLinkItem}>
              <a href="#">
                <HelpCenterIcon /> Help Center
              </a>
            </li>
            <li className={s.navLinkItem}>
              <a href="#">
                <GearIcon /> Settings
              </a>
            </li>
          </ul>
        </aside>
        <div className={s.main}>
          <div className={s.mainHeader}>
            <div>
              <input
                type="text"
                placeholder="Search transactions, invoices or help"
              />
            </div>
            <div className={s.mainHeaderRight}>
              <a href="#">
                <WebIcon />
              </a>
              <a href="#">*Chat icon*</a>
              <a href="#">*Bell icon*</a>

              <span className={s.mainHeaderRightDivider} />

              <button className={s.mainHeaderRightProfileButton}>
                John Doe <ArrowDownIcon />
              </button>
              <div className={s.mainHeaderRightAvatar}>
                <img src={johnDoeImage} alt="" />
              </div>
            </div>
          </div>
          <div className={s.mainCalendarOutterWrapper}>
            <h1 className={s.pageTitle}>Calendar</h1>
            <div>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  start: "today,prev,next", // will normally be on the left. if RTL, will be on the right
                  center: "title",
                  end: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                initialView="dayGridMonth"
                eventColor="#3B86FF"
                weekends={false}
                events={events}
                eventContent={renderEventContent}
                dateClick={function (info) {
                  console.log("dateClick: ", info);

                  formik.resetForm();
                  setEventId("");

                  formik.setFieldValue("date", info.date);
                  formik.setFieldValue("time", info.date);

                  setAnchor({
                    x: info.jsEvent.pageX,
                    y: info.jsEvent.pageY,
                  });
                  setShowPopover(true);
                }}
                eventClick={(selectedEvent) => {
                  console.log("event click: ", selectedEvent);

                  const event = events.find(
                    //@ts-ignore
                    (event) => event.id === selectedEvent.event.id
                  );
                  if (!event) {
                    return;
                  }

                  formik.resetForm();
                  setEventId(event.id);

                  formik.setFieldValue("name", event.title);
                  formik.setFieldValue("date", event.start);
                  formik.setFieldValue("time", event.start);
                  formik.setFieldValue("notes", "");

                  setAnchor({
                    x: selectedEvent.jsEvent.pageX,
                    y: selectedEvent.jsEvent.pageY,
                  });
                  setShowPopover(true);
                }}
              />
            </div>
          </div>
        </div>
        {createPortal(
          <div
            className={`${s.eventPopover} ${
              showPopover && s.eventPopoverVisible
            }`}
            style={{ top: anchor.y, left: anchor.x }}
          >
            <button
              className={s.popoverCloseButton}
              onClick={() => {
                setShowPopover(false);
                setAnchor({});
              }}
            >
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
                onClick={() => {
                  setShowPopover(false);
                  setAnchor({});
                }}
              >
                Cancel
              </button>
              <button
                className={s.popoverFooterButtonSave}
                type="submit"
                form={`${id}-form`}
              >
                Save
              </button>
            </div>
          </div>,
          document.body
        )}
      </main>
    </>
  );
}

// a custom render function
function renderEventContent(eventInfo: any) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

export default App;
