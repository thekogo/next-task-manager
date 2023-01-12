import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "~/lib/session";
import { createTask, getTaskByGroupId, getTaskByGroupIdAndUserId } from '~/services/models/task.server';
import { getUserById } from "~/services/models/user.server";

export type createTaskData = {
  title: string;
  description: string | null;
  alertDate: Date | null;
  deadLineDate: Date | null;
  groupId: number;
}

async function getTaskByGroupIdAndUserIdRoute(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user;
  if (!user || user.isLoggedIn === false) {
    return res.status(400).json({isLoggedIn: false})
  }

  const userProfile = await getUserById(user.userId);
  if (!userProfile) {
    return res.status(401).end();
  }

  const groupId = Number(req.query.groupId)
  if (!groupId) {
    return res.status(400).end();
  }

  let tasks: Awaited<ReturnType<typeof getTaskByGroupId>> = []
  const userId = Number(req.query.userId);
  if (userId === 0) {
    tasks = await getTaskByGroupId({groupId: groupId})
  } else {
    tasks = await getTaskByGroupIdAndUserId({groupId: groupId, userId: userId})
  }

  return res.json(tasks)
}

export default withIronSessionApiRoute(getTaskByGroupIdAndUserIdRoute, sessionOptions)
