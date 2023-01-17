import { MessageEvent, PostbackEvent, WebhookEvent } from '@line/bot-sdk';
import type { NextApiRequest, NextApiResponse } from 'next'
import handleMessage from '~/services/linebot/handleMessage';
import handlePostback from '~/services/linebot/handlePostback';

async function taskEventHandler(event: WebhookEvent) {
  switch (event.type) {
    case "message": return await handleMessage(event);
    case "postback": return await handlePostback(event);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const events: WebhookEvent[] = req.body.events;
  const results = await Promise.all(
    events.map(async (event: WebhookEvent) => {
      try {
        await taskEventHandler(event);
      } catch(e) {
        // console.error(e)
      }
    })
  );
  res.status(200).json({ status: 'success', results })
}
