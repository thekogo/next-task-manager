import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "~/lib/session";
import { createTask } from '~/services/models/task.server';
import { getUserById } from "~/services/models/user.server";

export type createTaskData = {
  title: string;
  description: string | null;
  alertDate: Date | null;
  deadLineDate: Date | null;
  groupId: number;
}

async function createTaskRoute(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user;
  if (!user || user.isLoggedIn === false) {
    return res.status(400).json({isLoggedIn: false})
  }

  const userProfile = await getUserById(user.userId);
  if (!userProfile) {
    return res.status(401).end();
  }

  const data: createTaskData = req.body;
  const group = await createTask({
    ...data,
    userId: user.userId
  })
  return res.json(group)
}

export default withIronSessionApiRoute(createTaskRoute, sessionOptions)
