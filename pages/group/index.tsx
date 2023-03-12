import { Button, Label, Table, TextInput, Modal } from "flowbite-react";
import { withIronSessionSsr } from "iron-session/next";
import Link from "next/link";
import { useEffect, useState } from "react"
import Nav from "~/components/Nav";
import { getGroupsByUserId, Group } from "~/services/models/group.server";
import { sessionOptions } from "~/lib/session";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import CreateModal from './_CreateModal';
import JoinModal from './_JoinModal';
import { useSetRecoilState } from "recoil";
import { groupState } from "~/store/groupState";

type Props = {
  groups: Awaited<ReturnType<typeof getGroupsByUserId>>
  // groups: Group[]
}

export default function GroupPage({groups}: Props) {
  const router = useRouter();
  const [showModalCreateGroup, setShowModalCreateGroup] = useState(false);
  const [showModalJoinGroup, setShowModalJoinGroup] = useState(false);
  const setGroupState = useSetRecoilState(groupState);

  useEffect(() => {
    console.log("group", groups)
    setGroupState(groups)
  }, [groups])

  return (
    <div>
      <CreateModal setShowModalCreateGroup={setShowModalCreateGroup} showModalCreateGroup={showModalCreateGroup} />
      <JoinModal setShowModalJoinGroup={setShowModalJoinGroup} showModalJoinGroup={showModalJoinGroup} />
      <Nav />
      <div className="container mx-auto">
        <div className="flex justify-between mb-2">
          <h3 className="text-xl">จัดการกลุ่ม</h3>
          <div className="flex gap-2">
            <Button outline={true} size="sm" onClick={() => setShowModalJoinGroup(true)}>เข้าร่วมกลุ่ม</Button>
            <Button color="purple" outline={true} size="sm" onClick={() => setShowModalCreateGroup(true)}>+ สร้างกลุ่ม</Button>
          </div>
        </div>
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <Table>
            <Table.Head>
              <Table.HeadCell>
                ชื่อกลุ่ม
              </Table.HeadCell>
              <Table.HeadCell>
                จัดการ
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="devide-y">
              {groups.map(group => (
                <Table.Row key={group.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {group.name}
                  </Table.Cell>
                  <Table.Cell>
                    <Link href={`/group/${group.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-500">View</Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(
// @ts-ignore
  async function getServerSideProps({req}) {
    const user = req.session.user;
    if (!user?.isLoggedIn) {
      return {
        redirect: {
          destination: "/"
        },
        props: {}
      }
    }
    const groups = await getGroupsByUserId({userId: user?.userId})
    return {
      props: {
        groups: groups
      }
    }
  }, sessionOptions
)
