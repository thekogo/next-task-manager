import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '~/lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { getUserOrCreateByLineProfile } from '~/services/models/user.server';
import { Profile } from '@line/bot-sdk';

export type LoginUser = {
  isLoggedIn: boolean;
  userId: number;
}

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { code } = await req.body
  const accessToken = await loginWithCode(code);
  const lineProfile = await getLineProfile(accessToken);
  console.log(lineProfile)
  const userProfile = await getUserOrCreateByLineProfile(lineProfile);

  try {
    const user = { isLoggedIn: true, userId: userProfile.id } as LoginUser
    req.session.user = user
    await req.session.save()
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error })
  }
}

async function loginWithCode(code: string): Promise<string> {
  const lineAccessTokenURL = "https://api.line.me/oauth2/v2.1/token";
  const clientId = process.env.CHANNEL_ID || "";
  const clientSecret =  process.env.LOGIN_CHANNEL_SECRET || "";
  const redirectUri = encodeURI(process.env.BASE_URL + "/login");
  const payload = JSON.stringify({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  })
  var urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "authorization_code");
  urlencoded.append("code", code);
  urlencoded.append("client_id", clientId);
  urlencoded.append("client_secret", clientSecret);
  urlencoded.append("redirect_uri", redirectUri);

  const response = await fetch(lineAccessTokenURL, {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    },
    body: urlencoded
  })
  const json: {access_token: string} = await response.json();
  const accessToken = json.access_token;
  return accessToken;
}

async function getLineProfile(accessToken: string): Promise<Profile> {
  const response = await fetch("https://api.line.me/v2/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return await response.json();
}


export default withIronSessionApiRoute(loginRoute, sessionOptions)
