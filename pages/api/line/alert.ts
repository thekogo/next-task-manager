import { addHours } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import sendAlertTask from "~/services/linebot/sendAlertTask";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let currentDate = new Date();
  currentDate.setSeconds(0,0)
  currentDate = addHours(currentDate, 7)
  await sendAlertTask({date: new Date(currentDate.toISOString())}) 
  res.status(200).json({ status: 'success' })
}
