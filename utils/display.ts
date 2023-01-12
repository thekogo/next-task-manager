import { TaskStatus, User } from "@prisma/client";
import th from "date-fns/locale/th";
import { formatWithOptions } from "date-fns/fp";

export function displayName(user: User) {
  if (user.firstName || user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  return user.displayName;
}

export function displayDate(date: Date | null | undefined) {
  if (!date) {
    return "-";
  }
  console.log(date);
  const dateToString = formatWithOptions({locale: th}, "dd MMMM yyyy | HH:mm น.");
  return dateToString(new Date(date));
}

export function displayStatus(status: string): string {
  switch (status) {
    case TaskStatus.CREATED: return "ยังไม่รับทราบ" 
    case TaskStatus.DOING: return "รับทราบแล้ว กำลังดำเนินการ"
    case TaskStatus.DONE: return "เสร็จเรียบร้อย"

    default: return "-"
  }
}
