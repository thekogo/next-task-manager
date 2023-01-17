import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from 'date-fns/format'
import { formatWithOptions } from 'date-fns/fp'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import th from 'date-fns/locale/th'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { getTaskByGroupId } from "~/services/models/task.server";
import { displayDate, displayName } from "~/utils/display";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";

const locales = {
  th
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

function formatDate(date: Date) {
  let monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม",
    "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม",
    "สิงหาคม", "กันยายน", "ตุลาคม",
    "พฤศจิกายน", "ธันวาคม"
  ];

  let day = date.getDate();
  let monthIndex = date.getMonth();
  let year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

// @ts-ignore
function Event({event}) {
  return (
    <span>
      <strong>{event.title}</strong>
      <span>[{displayName(event.user)}]</span>
    </span>
  )
}

// @ts-ignore
function AgendaEvent({event}) {
  return (
    <span>
      <strong>{event.title}</strong>
      <p>{event.description || "-"}</p>
      <p>กำหนดส่ง {displayDate(event.deadLineDate)}<br />
        กำหนดแจ้งเตือน {displayDate(event.alertDate)}
      </p>
      <p>ผู้รับผิดชอบ {displayName(event.user)}</p>
    </span>
  )
}

// @ts-ignore
function AgendaDate({day}) {
  const dateToString = formatWithOptions({locale: th}, "dd MMMM yyyy")
  return (
    <span>{dateToString(day)}</span>
  )
}

// @ts-ignore
function AgendaTime({event}) {
  return (
    <span>{format(new Date(event.deadLineDate), 'HH:mm น.')}</span>
  )
}

type Props = {
  tasks: Awaited<ReturnType<typeof getTaskByGroupId>>
}

export type EventTask = {
  id: number;
  title: string;
  description: string | null | undefined;
  user: User;
  start: Date | undefined;
  end: Date | undefined;
  alertDate: Date | undefined | null;
  deadLineDate: Date | undefined;
}

export default function TaskCalendar({tasks}: Props) {

  let [events, setEvents] = useState<EventTask[]>([]);
  useEffect(() => {
    let tempEvents: EventTask[] = []
    tasks.forEach(task => {
      if (!task.deadLineDate) {
        return;
      }

      tempEvents.push({
        id: task.id,
        title: task.title,
        description: task.description,
        user: task.worker.user,
        start: new Date(task.deadLineDate),
        end: new Date(task.deadLineDate),
        deadLineDate: task.deadLineDate,
        alertDate: task.alertDate,
      })
    })
    setEvents([...tempEvents])
  }, tasks)

// @ts-ignore
  return <Calendar
    events={events}
    views={['month', 'agenda']}
    style={{height: '100%', minHeight: '50vh'}}
    localizer={localizer}
    culture={"th-TH"}
    components={{
      event: Event,
      agenda: {
        date: AgendaDate,
        time: AgendaTime,
        event: AgendaEvent
      }
    }}
  />
}
