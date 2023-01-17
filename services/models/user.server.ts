import { Profile } from "@line/bot-sdk";
import type { User } from "@prisma/client";

import { prisma } from "~/services/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserOrCreateByLineProfile(lineProfile: Profile) {
  return prisma.user.upsert({
    where: {
      lineId: lineProfile.userId,
    },
    update: {},
    create: {
      lineId: lineProfile.userId,
      displayName: lineProfile.displayName,
      pictureUrl: lineProfile.pictureUrl,
    }
  })
}

export async function updateProfile({userId, firstName, lastName}: {
  userId: User["id"];
  firstName: User["firstName"];
  lastName: User["lastName"];
}) {
  return await prisma.user.update({
    where: {
      id: userId
    }, 
    data: {
      firstName: firstName,
      lastName: lastName
    }
  })
}
