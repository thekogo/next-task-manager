import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'
import { User } from '@prisma/client'
import axios from 'axios'


export default function useUser({
  redirectTo = '/',
  redirectIfFound = false,
} = {}) {
  const fetcher = (url: string) => axios.get(url).then(res => res.data)
  const { data: user } = useSWR<User>('/api/user/profile', fetcher)

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.id) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.id)
    ) {
      Router.push(redirectTo)
    }
  }, [user, redirectIfFound, redirectTo])

  return user
}
