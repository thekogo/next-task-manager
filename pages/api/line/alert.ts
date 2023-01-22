import { addHours } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import sendAlertTask from "~/services/linebot/sendAlertTask";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let currentDate = new Date();
  currentDate.setSeconds(0,0)
  try {
    await sendAlertTask({date: new Date(currentDate.toISOString())}) 
  } catch(e) {
    console.log(e.orignalError.response.data)
  }
  res.status(200).json({ status: 'success' })
}
