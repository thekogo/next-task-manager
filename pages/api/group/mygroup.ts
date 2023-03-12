
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "~/lib/session";
import { getGroupsByUserId } from '~/services/models/group.server';
import { getUserById } from "~/services/models/user.server";

async function getTaskByGroupIdAndUserIdRoute(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user;
  if (!user || user.isLoggedIn === false) {
    return res.status(400).json({isLoggedIn: false})
  }

  const userProfile = await getUserById(user.userId);
  if (!userProfile) {
    return res.status(401).end();
  }

  const groups = await getGroupsByUserId({ userId: user.userId})

  return res.json(groups)
}

export default withIronSessionApiRoute(getTaskByGroupIdAndUserIdRoute, sessionOptions)
