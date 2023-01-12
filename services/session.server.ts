import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

export const createUserSession = async ({request, userId}: {
  request: IncomingMessage & {
    cookies: NextApiRequestCookies
  };
  userId: number
}) => {
  console.log(request.cookies)
}
