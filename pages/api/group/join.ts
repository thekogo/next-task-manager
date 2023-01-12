import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "~/lib/session";
import { createGroup, getGroupByCode, joinGroup } from '~/services/models/group.server';
import { getUserById } from "~/services/models/user.server";

export type joinGroupData = {
  code: string;
}

async function joinGroupRoute(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user;
  if (!user || user.isLoggedIn === false) {
    return res.status(400).json({isLoggedIn: false})
  }

  const userProfile = await getUserById(user.userId);
  if (!userProfile) {
    return res.status(401).end();
  }

  const {code}: joinGroupData = req.body;
  const group = await getGroupByCode({code});
  if (!group) {
    return res.status(400).json({message: "ไม่พบรหัสเข้ากลุ่มนี้ในระบบ"})
  }
  const groupMember = await joinGroup({
    userId: user.userId,
    groupId: group.id
  })
  return res.json({message: "เข้าร่วมกลุ่มเรียบร้อย", group: group})
}

export default withIronSessionApiRoute(joinGroupRoute, sessionOptions)
