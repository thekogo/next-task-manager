import { GroupMember, User } from "@prisma/client";
import axios from "axios";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { withIronSessionSsr } from "iron-session/next";
import { Router, useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import Nav from "~/components/Nav";
import { sessionOptions } from "~/lib/session";
import { getGroupMember, getGroupMemberByGroupId } from "~/services/models/group.server";

type Props = {
  groupMembers: Awaited<ReturnType<typeof getGroupMemberByGroupId>>
}

function MemberDetail({member, refreshPage}: { 
  member: GroupMember & { user: User }
  refreshPage: Function
}) {
  const [showForm, setShowForm] = useState(false);

  async function submitEdit(e: React.SyntheticEvent) {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      firstName: { value: string};
      lastName: { value: string};
    }

    const data = {
      firstName: target.firstName.value,
      lastName: target.lastName.value
    }
    try {
      await axios.post(`/api/user/${member.userId}/edit`, data);
      toast("แก้ไขข้อมูลสมาชิกเรียบร้อย");
      setShowForm(false);
      refreshPage();
    } catch(e) {
      console.log(e);
    }
  }
  return (
    <li key={member.userId} className="cursor-pointer py-3 sm:py-4 hover:bg-gray-100 px-10">
      <div className="flex items-center space-x-4" onClick={() => setShowForm(!showForm)}>
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
      {showForm && <form onSubmit={submitEdit} className="mt-4 flex flex-col gap-4">
        <hr className="mt-4"/>
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="firstName"
              value="ชื่อ"
              />
          </div>
          <TextInput
            id="firstName"
            type="text"
            sizing="sm"
            defaultValue={member.user.firstName || ""}
            />
        </div>
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="lastName"
              value="นามสกุล"
              />
          </div>
          <TextInput
            id="lastName"
            type="text"
            sizing="sm"
            defaultValue={member.user.lastName || ""}
            />
        </div>
        <Button color="purple" type="submit" size={"sm"}>บันทึก</Button>
      </form>
    }    
    </li>
  )
}

export default function MemberView({groupMembers}: Props) {
  const router = useRouter()

  function refreshPage() {
    router.replace(router.asPath)
  }
  return (
    <div>
      <Nav />
      <div className="container mx-auto">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              สมาชิก
            </h5>
          </div>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {groupMembers.map(member => (
                <MemberDetail member={member} key={member.userId} refreshPage={refreshPage} />
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(
  // @ts-ignore
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
        groupMembers: JSON.parse(JSON.stringify(groupMembers))
      }
    }
  }, sessionOptions
)
