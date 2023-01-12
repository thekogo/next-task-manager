import axios from "axios";
import { Button, Card, Label, Select, TextInput } from "flowbite-react";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Nav from "~/components/Nav";
import { sessionOptions } from "~/lib/session";
import { createTaskData } from "~/pages/api/task/create";
import { getGroupMember, getGroupMemberByGroupId } from "~/services/models/group.server";
import { getTaskByGroupId } from "~/services/models/task.server";
import { displayName } from "~/utils/display";
import TaskCalendar from "~/components/TaskCalendar";

type Props = {
  groupMembers: Awaited<ReturnType<typeof getGroupMemberByGroupId>>
  tasks: Awaited<ReturnType<typeof getTaskByGroupId>>
}

export default function CreateTaskView({groupMembers, tasks}: Props) {
  const router = useRouter();
  const { groupId } = router.query;

  async function submitCreateTask(e: React.SyntheticEvent) {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      title: { value: string};
      description: { value: string};
      userId: { value: number};
      alertDate: { value: Date};
      deadLineDate: { value: Date};
    }

    const data: createTaskData = {
      title: target.title.value,
      description: target.description.value,
      alertDate: new Date(target.alertDate.value) || null,
      deadLineDate: new Date(target.deadLineDate.value) || null,
      groupId: Number(groupId)
    }
    try {
      await axios.post("/api/task/create", data);
      toast("สร้างงานเสร็จสมบูรณ์");
    } catch(e) {
      console.log(e);
    }
  }
  return (
    <div>
      <Nav />
      <div className="container mx-auto">
        <div className="grid grid-cols-3 lg:grid-cols-12 gap-4">
          <div className="col-span-3">
            <Card>
              <form onSubmit={submitCreateTask} className="flex flex-col gap-4" method="post">
                <div>
                  <div className="mb-2 block">
                    <Label
                      htmlFor="title"
                      value="หัวข้อ"
                      />
                  </div>
                  <TextInput
                    id="title"
                    name="title"
                    type="text"
                    />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label
                      htmlFor="description"
                      value="รายละเอียด"
                      />
                  </div>
                  <TextInput
                    id="description"
                    name="description"
                    type="text"
                    sizing="lg"
                    />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label
                      htmlFor="workerId"
                      value="มอบหมายงานให้"
                      />
                  </div>
                  <Select
                    id="userId"
                    name="userId"
                    required={true}
                  >
                    {groupMembers.map(member => (
                      <option value={member.user.id}>
                        {displayName(member.user)}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label
                      htmlFor="alertDate"
                      value="เวลาแจ้งเตือน"
                      />
                  </div>
                  <TextInput
                    id="alertDate"
                    name="alertDate"
                    type="datetime-local"
                    />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label
                      htmlFor="deadLineDate"
                      value="กำหนดส่ง"
                      />
                  </div>
                  <TextInput
                    id="deadLineDate"
                    name="deadLineDate"
                    type="datetime-local"
                    />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" color="purple">สร้างงาน</Button>
                </div>
              </form>
            </Card>
          </div>
          <div className="lg:col-span-9 col-span-3">
            <Card className="h-full flex flex-col">
              <TaskCalendar tasks={tasks} />
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
    const tasks = await getTaskByGroupId({groupId})

    return {
      props: {
        code: groupMember.group.code,
        groupMembers: JSON.parse(JSON.stringify(groupMembers)),
        tasks: JSON.parse(JSON.stringify(tasks))
      }
    }
  }, sessionOptions
)
