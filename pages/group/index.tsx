import { Button, Table } from "flowbite-react";
import Link from "next/link";
import { useState } from "react"
import Nav from "~/components/Nav";
import CreateModal from './_CreateModal';
import JoinModal from './_JoinModal';
import { useRecoilValue } from "recoil";
import { groupState } from "~/store/groupState";

export default function GroupPage() {
  const [showModalCreateGroup, setShowModalCreateGroup] = useState(false);
  const [showModalJoinGroup, setShowModalJoinGroup] = useState(false);
  const groups = useRecoilValue(groupState)

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
