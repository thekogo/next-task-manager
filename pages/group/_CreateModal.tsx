import axios from "axios";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import router from "next/router";
import { toast } from "react-toastify";

type Props = {
  showModalCreateGroup: boolean;
  setShowModalCreateGroup: Function
}
export default ({showModalCreateGroup, setShowModalCreateGroup}: Props) => {

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

  return (
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
}
