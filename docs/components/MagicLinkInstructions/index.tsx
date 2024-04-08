import { useState } from "react"
import cx from "classnames"
import { Link } from "@/components/Link"
import NodemailerSetup from "./content/NodemailerSetup.mdx"
import ResendSetup from "./content/ResendSetup.mdx"
import SendgridSetup from "./content/SendgridSetup.mdx"
import PostmarkSetup from "./content/PostmarkSetup.mdx"
import { Callout } from "nextra/components"

const EmailTypes = {
  Resend: "Resend",
  Postmark: "Postmark",
  Sendgrid: "Sendgrid",
  Nodemailer: "Nodemailer",
} as const

export function MagicLinkInstructions() {
  const [activeEmailType, setActiveEmailType] =
    useState<keyof typeof EmailTypes>()

  return (
    <div className="flex *:mt-0 flex-col gap-6 items-start">
      {!activeEmailType ? (
        <h3 className="text-lg font-semibold">
          Please select an email provider.
        </h3>
      ) : null}
      <p>
        This login mechanism starts by the user providing their email address at
        the login form. Then a <b>Verification Token</b> is sent to the provided
        email address. The user then has 24 hours to click the link in the email
        body to "consume" that token and register their account, otherwise the
        verification token will expire and they will have to request a new one.
      </p>
      <Callout>
        An Email Provider can be used with both{" "}
        <Link href="https://jwt.io/">JSON Web Tokens</Link> and{" "}
        <Link href="/concepts/session-strategies#database-session">
          database
        </Link>{" "}
        session, whichever you choose, you{" "}
        <b>must still configure a database</b> so that Auth.js can save the
        verification tokens and look them up when the user attempts to login. It
        is not possible to enable an email provider without using a database.
      </Callout>
      <div className="flex flex-row gap-4 pb-3 mt-3">
        <button
          aria-disabled="true"
          aria-selected={activeEmailType === EmailTypes.Resend}
          onClick={() => setActiveEmailType(EmailTypes.Resend)}
          className={cx(
            "flex flex-col gap-2 justify-around items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-sm dark:border-neutral-800 dark:hover:bg-neutral-950 hover:bg-neutral-50 transition-colors duration-300",
            activeEmailType === EmailTypes.Resend &&
              "dark:bg-neutral-950 bg-neutral-100"
          )}
        >
          <img className="size-16" src={`/img/providers/resend.svg`} />
          <div className="text-sm text-center">Resend</div>
        </button>
        <button
          aria-selected={activeEmailType === EmailTypes.Sendgrid}
          onClick={() => setActiveEmailType(EmailTypes.Sendgrid)}
          className={cx(
            "flex flex-col gap-2 justify-around items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-sm dark:border-neutral-800 dark:hover:bg-neutral-950 hover:bg-neutral-50 transition-colors duration-300",
            activeEmailType === EmailTypes.Sendgrid &&
              "dark:bg-neutral-950 bg-neutral-100"
          )}
        >
          <img className="size-16" src={`/img/providers/sendgrid.svg`} />
          <div className="text-sm text-center">Sendgrid</div>
        </button>
        <button
          aria-selected={activeEmailType === EmailTypes.Nodemailer}
          onClick={() => setActiveEmailType(EmailTypes.Nodemailer)}
          className={cx(
            "flex flex-col gap-2 justify-around items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-sm dark:border-neutral-800 dark:hover:bg-neutral-950 hover:bg-neutral-50 transition-colors duration-300",
            activeEmailType === EmailTypes.Nodemailer &&
              "dark:bg-neutral-950 bg-neutral-100"
          )}
        >
          <img className="size-16" src={`/img/providers/nodemailer.svg`} />
          <div className="text-sm text-center">Nodemailer</div>
        </button>
        <button
          aria-selected={activeEmailType === EmailTypes.Postmark}
          onClick={() => setActiveEmailType(EmailTypes.Postmark)}
          className={cx(
            "flex flex-col gap-2 justify-around items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-sm dark:border-neutral-800 dark:hover:bg-neutral-950 hover:bg-neutral-50 transition-colors duration-300",
            activeEmailType === EmailTypes.Postmark &&
              "dark:bg-neutral-950 bg-neutral-100"
          )}
        >
          <img className="size-16" src={`/img/providers/postmark.png`} />
          <div className="text-sm text-center">Postmark</div>
        </button>
      </div>
      {activeEmailType === EmailTypes.Resend ? <ResendSetup /> : null}
      {activeEmailType === EmailTypes.Sendgrid ? <SendgridSetup /> : null}
      {activeEmailType === EmailTypes.Nodemailer ? <NodemailerSetup /> : null}
      {activeEmailType === EmailTypes.Postmark ? <PostmarkSetup /> : null}
    </div>
  )
}
