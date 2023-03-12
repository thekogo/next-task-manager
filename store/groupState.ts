import { atom } from "recoil";
import { getGroupsByUserId } from "~/services/models/group.server";

export const groupState = atom({
  key: 'groupState',
  default: {} as Awaited<ReturnType<typeof getGroupsByUserId>>
})
