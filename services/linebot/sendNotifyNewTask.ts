import { TemplateMessage } from "@line/bot-sdk";
import { Task } from "@prisma/client";
import { displayDate } from "~/utils/display";
import client, { ActionType } from "../line.server";

export default async function sendNotifyNewTask({task, lineId}: {
  task: Task;
  lineId: string;
}) {
  let title = task.title;
  let desc = task.description || '';
  if(desc.length > 30) {
    desc = desc.substring(0, 30) + '...'
  }
  if(title.length > 30) {
    title = title.substring(0, 30) + '...'
  }

  const message: TemplateMessage = {
    type: "template",
    altText: "แจ้งเตือนงานใหม่",
    template: {
      type: "buttons",
      actions: [
        {
          type: "postback",
          data: `action=${ActionType.Acknowledge}&taskId=${task.id}`,
          label: "รับทราบ",
          text: `รับทราบ`
        }
      ],
      title: `${task.title}`,
      text: desc + '\r\nกำหนดส่งงาน: ' + displayDate(task.deadLineDate)
    }
  }
  try {
    await client.pushMessage(lineId, message);
  } catch(e) {
    console.log(e.originalError.response.data)
  }
}

