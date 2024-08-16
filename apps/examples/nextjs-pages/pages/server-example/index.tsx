import CustomLink from "@/components/custom-link"
import SessionData from "@/components/session-data"
// import { auth } from "../../auth"
// import { getSession } from "next-auth/react"
import type { Session } from "next-auth"
import type { GetServerSidePropsContext } from "next"
import type { InferGetServerSidePropsType, GetServerSideProps } from "next"

export default function Page({
  serverSession: session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="mx-auto mt-10 space-y-4 max-w-screen-md">
      <h1 className="text-3xl font-bold">
        <code>getServerSideProps</code> Usage
      </h1>
      <p className="leading-loose">
        This page is server-rendered server-side using{" "}
        <CustomLink href="https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props">
          `getServerSideProps`
        </CustomLink>
        .
      </p>
      <SessionData session={session} />
    </div>
  )
}

export const getServerSideProps = (async (
  context: GetServerSidePropsContext
) => {
  // const session = await getSession()
  const url = `${context.req.headers["x-forwarded-proto"]}://${context.req.headers.host}/api/auth/session`

  // TODO: Test while working on other methods
  const sessionRes = await fetch(url, {
    headers: new Headers(context.req.headers as Record<string, string>),
  })
  const serverSession: Session = await sessionRes.json()
  return { props: { serverSession } }
}) as GetServerSideProps<{ serverSession: Session }>
