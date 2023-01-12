import { Card } from "flowbite-react";
import { withIronSessionSsr } from "iron-session/next";
import Nav from "~/components/Nav";
import { sessionOptions } from "~/lib/session";
import { getGroupMember, getGroupMemberByGroupId } from "~/services/models/group.server";

type Props = {
  code: string;
  groupMembers: Awaited<ReturnType<typeof getGroupMemberByGroupId>>
}

export default function GroupDetailPage({code, groupMembers}: Props) {
  return (
    <div>
      <Nav />
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-12 grid-cols-3 gap-4">
          <div className="col-span-3">
            <Card>
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                รหัสสำหรับเข้าร่วม
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {code}
              </p>
            </Card>
          </div>
          <div className="col-span-3 lg:col-span-9">
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                  สมาชิก
                </h5>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  จัดการสมาชิก
                </a>
              </div>
              <div className="flow-root">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {groupMembers.map(member => (
                    <li key={member.userId} className="py-3 sm:py-4">
                      <div className="flex items-center space-x-4">
                        <div className="shrink-0">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={member.user.pictureUrl}
                            alt="Neil image"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                            {member.user.firstName} {member.user.lastName}
                          </p>
                          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                            {member.user.displayName}
                          </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                          {member.position}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({req, query}) {
    const user = req.session.user;
    if (!user?.isLoggedIn) {
      return {
        redirect: {
          destination: "/"
        },
        props: {}
      }
    }

    const groupId = Number(query.groupId)
    console.log(user)
    const groupMember = await getGroupMember({userId: user.userId, groupId: groupId})
    if (!groupMember) {
      return {
        redirect: {
          destination: "/"
        },
        props: {}
      }
    }
    const groupMembers =  await getGroupMemberByGroupId({groupId});

    return {
      props: {
        code: groupMember.group.code,
        groupMembers: JSON.parse(JSON.stringify(groupMembers))
      }
    }
  }, sessionOptions
)
