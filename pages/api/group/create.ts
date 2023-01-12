import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "~/lib/session";
import { createGroup, getGroupByCode } from '~/services/models/group.server';
import { getUserById } from "~/services/models/user.server";

export type createGroupData = {
  name: string;
  code: string;
}

async function createGroupRoute(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user;
  if (!user || user.isLoggedIn === false) {
    return res.status(400).json({isLoggedIn: false})
  }

  const userProfile = await getUserById(user.userId);
  if (!userProfile) {
    return res.status(401).end();
  }

  const data: createGroupData = req.body;
  const groupCode = await getGroupByCode({code: data.code})
  if (groupCode) {
    return res.status(400).json({message: "รหัสเข้าร่วมกลุ่มซ้ำกับกลุ่มอื่น"})
  }
  const group = await createGroup({
    userId: user.userId,
    name: data.name,
    code: data.code,
  })
  return res.json({message: "สร้างกลุ่มสำเร็จ", group: group})
}

export default withIronSessionApiRoute(createGroupRoute, sessionOptions)
