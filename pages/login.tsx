import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();
  const code = router.query.code;
  useEffect(() => {
    if (!code) {
      return;
    }
    axios.post("/api/login", {
      code: code
    }).then(() => {
        router.push("/group")
      }).catch(() => {
        router.push("/")
      })
  }, [code])
  return <></>
}
