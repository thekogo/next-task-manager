import axios from "axios";
import { Button, Label, Modal, TextInput } from "flowbite-react"
import router from "next/router";
import { toast } from "react-toastify";

type Props = {
  showModalJoinGroup: boolean;
  setShowModalJoinGroup: Function;
}

export default function JoinModal ({ showModalJoinGroup, setShowModalJoinGroup }: Props) {

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

  return (
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
  )}
