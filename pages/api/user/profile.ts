import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "~/lib/session";
import { getUserById } from "~/services/models/user.server";

async function getProfile(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user;
  if (!user || user.isLoggedIn === false) {
    return res.json({isLoggedIn: false})
  }
  console.log(user);

  const userProfile = await getUserById(user.userId);
  if (!userProfile) {
    return res.status(400)
  }
  return res.json(userProfile)
}

export default withIronSessionApiRoute(getProfile, sessionOptions)
