import { Group } from "@prisma/client";
import { Button, Label, Table, TextInput, Modal } from "flowbite-react";
import { withIronSessionSsr } from "iron-session/next";
import Link from "next/link";
import { useState } from "react"
import Nav from "~/components/Nav";
import { getGroupsByUserId } from "~/services/models/group.server";
import { sessionOptions } from "~/lib/session";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

type Props = {
  groups: Group[]
}

export default function GroupPage({groups}: Props) {
  const router = useRouter();
  const [showModalCreateGroup, setShowModalCreateGroup] = useState(false);
  const [showModalJoinGroup, setShowModalJoinGroup] = useState(false);

  async function submitCreateGroup(e: React.SyntheticEvent) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string};
      code: { value: string};
    }

    const name = target.name.value
    const code = target.code.value
    try {
      const res = await axios.post("/api/group/create", {
        name: name,
        code: code
      });
      toast.info("สร้างกลุ่มเรียบร้อย")
      router.push("/group/"+res.data.group.id)

    } catch(e) {
      toast.error(e.response.data.message)
    }
  }

  async function submitJoinGroup(e: React.SyntheticEvent) {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      code: { value: string};
    }

    const code = target.code.value
    try {
      const res = await axios.post("/api/group/join", {
        code: code
      });
      toast.info("เข้าร่วมกลุ่มเรียบร้อย")
      router.push("/group/"+res.data.group.id)

    } catch(e) {
      toast.error(e.response.data.message)
    }
  }

  const CreateModal = () => (
    <Modal show={showModalCreateGroup} onClose={() => setShowModalCreateGroup(false)}>
      <Modal.Header>
        สร้างกลุ่มใหม่
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={submitCreateGroup} className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="name"
                value="ชื่อกลุ่ม"
                />
            </div>
            <TextInput
              id="name"
              name="name"
              placeholder="PEA ..."
              required={true}
              />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="code"
                value="รหัสสำหรับเข้ากลุ่ม"
                />
            </div>
            <TextInput
              id="code"
              name="code"
              placeholder="PEA_XXX"
              required={true}
              />
          </div>
          <div className="w-full flex justify-end">
            <Button type="submit">สร้างกลุ่ม</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )

  const JoinModal = () => (
    <Modal show={showModalJoinGroup} onClose={() => setShowModalJoinGroup(false)}>
      <Modal.Header>
        เข้าร่วมกลุ่ม
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={submitJoinGroup} className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="code"
                value="รหัสเข้าร่วมกลุ่ม"
                />
            </div>
            <TextInput
              id="code"
              name="code"
              placeholder="PEA ..."
              required={true}
              />
          </div>
          <div className="w-full flex justify-end">
            <Button type="submit">เข้าร่วมกลุ่ม</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )

  return (
    <div>
      <CreateModal />
      <JoinModal />
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
