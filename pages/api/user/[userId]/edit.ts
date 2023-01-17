import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "~/lib/session";
import { getUserById, updateProfile } from "~/services/models/user.server";

async function editProfile(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user;
  if (!user || user.isLoggedIn === false) {
    return res.json({isLoggedIn: false})
  }
  console.log(user);

  const userProfile = await getUserById(Number(req.query.userId));
  if (!userProfile) {
    return res.status(400)
  }

  const { firstName, lastName } = req.body;

  const newProfile = await updateProfile({userId: userProfile.id, firstName, lastName})
  return res.json(newProfile)
}

export default withIronSessionApiRoute(editProfile, sessionOptions)
