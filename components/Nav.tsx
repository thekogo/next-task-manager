import { Role } from "@prisma/client";
import { Navbar } from "flowbite-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { groupState } from "~/store/groupState";


export default function Nav() {
  const router = useRouter()
  const { groupId } = router.query
  const pathname = router.pathname
  const groups = useRecoilValue(groupState);
  const [isManager, setIsManager] = useState(false)
  
  useEffect(() => {
    if(groups.length > 0) {
      const currentGroup = groups.find(group => group.id === Number(groupId))
      const myPermission = currentGroup?.members.find(user => user.role === Role.MANAGER)
      setIsManager(myPermission !== undefined);
    }
  }, [groupId, groups])

  return (
    <Navbar
      fluid={true}
      rounded={true}
      className="container mx-auto"
    >
      <Navbar.Brand href="/group">
        <img
          src="/logo.jpg"
          className="mr-3 h-6 sm:h-9 rounded-md"
          alt="PEA Task Manager"
          />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          PEA Task Manager
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link
          href={`/group`}
          active={pathname === "/group"}
        >
          หน้าแรก
        </Navbar.Link>
        {groupId && 
          <>
            {isManager && 
              <>
                <Navbar.Link 
                  href={`/group/${groupId}`}
                  active={pathname === "/group/[groupId]"}
                >
                  สมาชิกกลุ่ม
                </Navbar.Link>
                <Navbar.Link 
                  href={`/group/${groupId}/create-task`}
                  active={pathname === "/group/[groupId]/create-task"}
                >
                  จัดการงาน
                </Navbar.Link>
                </>
            }
            <Navbar.Link 
              href={`/group/${groupId}/list-task`}
              active={pathname === "/group/[groupId]/list-task"}
            >
              รายการงาน
            </Navbar.Link>
            </>
      }
      </Navbar.Collapse>
    </Navbar>
  )
}
