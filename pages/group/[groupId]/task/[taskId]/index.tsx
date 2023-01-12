import { Card, Label, TextInput, Timeline } from "flowbite-react";
import { withIronSessionSsr } from "iron-session/next";
import { useRouter } from "next/router";
import Nav from "~/components/Nav";
import { sessionOptions } from "~/lib/session";
import { getCommentByTaskId } from "~/services/models/comment.server";
import { getGroupMember } from "~/services/models/group.server";
import { getTaskById } from "~/services/models/task.server";
import { displayDate, displayName } from "~/utils/display";

type Props = {
  task: Awaited<ReturnType<typeof getTaskById>>;
  comments: Awaited<ReturnType<typeof getCommentByTaskId>>;
}

export default function TaskView({task, comments}: Props) {
  const router = useRouter()
  const { groupId } = router.query
  if (!task) {
    router.push("/group/"+groupId+"/list-task")
  }
  return (
    <div>
      <Nav />
      <div className="container mx-auto flex flex-col gap-4">
        <Card>
          <h3 className="text-xl bold">รายละเอียดงาน</h3>
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
              value={task.title}
              disabled={true}
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
              value={task.description || ""}
              disabled={true}
              />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="workerId"
                value="ผู้รอบมอบหมาย"
                />
            </div>
            <TextInput
              id="workerId"
              name="workerId"
              type="text"
              sizing="lg"
              value={displayName(task.worker.user)}
              disabled={true}
              />
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
              type="text"
              value={displayDate(task.alertDate)}
              disabled={true}
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
              type="text"
              value={displayDate(task.deadLineDate)}
              disabled={true}
              />
          </div>
        </Card>
        <Card>
          <h3 className="text-xl">การตอบกลับ</h3>
          <Timeline>
            {comments.map(comment => (
              <Timeline.Item key={comment.id}>
                <Timeline.Point />
                <Timeline.Content>
                  <Timeline.Time>
                    {displayDate(comment.createdAt)}
                  </Timeline.Time>
                  <Timeline.Body>
                    {comment.message}
                  </Timeline.Body>
                </Timeline.Content>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
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
    const taskId = Number(query.taskId);
    const task = await getTaskById({taskId: taskId});
    if (!task) {
      return {
        redirect: {
          destination: "/"
        },
        props: {}
      }
    }

    const comments = await getCommentByTaskId({taskId: taskId});

    return {
      props: {
        task: JSON.parse(JSON.stringify(task)),
        comments: JSON.parse(JSON.stringify(comments))
      }
    }
  }, sessionOptions
)
