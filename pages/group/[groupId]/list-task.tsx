import { Role } from "@prisma/client";
import axios from "axios";
import { Button, Card, Select, Table } from "flowbite-react";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import Nav from "~/components/Nav";
import TaskCalendar from "~/components/TaskCalendar";
import { sessionOptions } from "~/lib/session";
import { getGroupMember, getGroupMemberByGroupId } from "~/services/models/group.server";
import { getTaskByGroupId } from "~/services/models/task.server";
import { groupState } from "~/store/groupState";
import { displayDate, displayName, displayStatus } from "~/utils/display";

type Props = {
  tasks: Awaited<ReturnType<typeof getTaskByGroupId>>;
  groupMembers: Awaited<ReturnType<typeof getGroupMemberByGroupId>>;
  userId: number;
}

export default function ListTaskView({groupMembers, userId}: Props) {
  const [filterTasks, setFilterTask] = useState<Awaited<ReturnType<typeof getTaskByGroupId>>>([]);
  const [filterUserId, setFilterUserId] = useState(0);
  const router = useRouter();
  const { groupId } = router.query;
  const groups = useRecoilValue(groupState);
  const [isManager, setIsManager] = useState(false)
  
  useEffect(() => {
    if(groups.length > 0) {
      const currentGroup = groups.find(group => group.id === Number(groupId))
      const myPermission = currentGroup?.members.find(user => user.role === Role.MANAGER)
      setIsManager(myPermission !== undefined);
    }
  }, [groupId, groups])

  useEffect(() => {
    const fetchData = async () => {
      const targetUser = isManager ? filterUserId : userId
      console.log(userId)
      const res = await axios.get(`/api/group/${groupId}/usertask/${targetUser}`);
      setFilterTask(res.data)
    }

    fetchData();
  }, [filterUserId])
  return (
    <div>
      <Nav />
      <div className="container mx-auto">
        { isManager && 
          <Card>
            <h3 className="text-xl">ผู้รับมอบหมาย</h3>
            <Select onChange={(e) => setFilterUserId(Number(e.currentTarget.value))}>
              <option value={0}>ทั้งหมด</option>
              {groupMembers.map(member => (
                <option key={member.userId} value={member.userId}>{displayName(member.user)}</option>
              ))}
            </Select>
          </Card>
        }
        <br />
        <Card>
          <h3 className="text-xl">รายการงาน</h3>
          <Table hoverable={true} striped={true}>
            <Table.Head>
              <Table.HeadCell>
                ID
              </Table.HeadCell>
              <Table.HeadCell>
                หัวข้อ
              </Table.HeadCell>
              <Table.HeadCell>
                สถานะ
              </Table.HeadCell>
              <Table.HeadCell>
                กำหนดส่ง
              </Table.HeadCell>
              <Table.HeadCell>
                จัดการ
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filterTasks.map(task => (
                <Table.Row key={task.id}>
                  <Table.Cell>
                    {task.id}
                  </Table.Cell>
                  <Table.Cell>
                    {task.title}
                  </Table.Cell>
                  <Table.Cell>
                    {displayStatus(task.status)}
                  </Table.Cell>
                  <Table.Cell>
                    {displayDate(task.deadLineDate)}
                  </Table.Cell>
                  <Table.Cell className="grid lg:grid-cols-3 grid-cols-1 justify-center gap-2 items-center">
                    <a href={`/group/${task.groupMemberGroupId}/task/${task.id}`} className="w-full">
                      <Button size="sm" className="h-full w-full">ดูรายละเอียด</Button>
                    </a>
                    { isManager && 
                      <>
                        <Button size="sm" color="warning" className="h-full">แก้ไข</Button>
                        <Button size="sm" color="failure" className="h-full">ลบ</Button>
                      </>
                    }
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
        <br />
        <Card>
          <h3 className="text-xl">ปฎิทินงาน</h3>
          <TaskCalendar tasks={filterTasks} />
        </Card>
      </div>
      <br />
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
        userId: user.userId,
        groupMembers: JSON.parse(JSON.stringify(groupMembers))
      }
    }
  }, sessionOptions
)
