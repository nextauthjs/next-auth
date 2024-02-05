import { useState } from "react"
import cx from "classnames"
import NodemailerSetup from "./content/NodemailerSetup.mdx"
import ResendSetup from "./content/ResendSetup.mdx"
import SendgridSetup from "./content/SendgridSetup.mdx"

const EmailTypes = {
  Nodemailer: "Nodemailer",
  Resend: "Resend",
  Sendgrid: "Sendgrid",
} as const

export function TokenAuthInstructions() {
  const [activeEmailType, setActiveEmailType] = useState<
    keyof typeof EmailTypes
  >(EmailTypes.Nodemailer)

  return (
    <>
      <div className="flex flex-row gap-4 pb-3 mt-3">
        <button
          aria-disabled="true"
          aria-selected={activeEmailType === EmailTypes.Resend}
          onClick={() => setActiveEmailType(EmailTypes.Resend)}
          className={cx(
            "flex flex-col gap-2 justify-around items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-lg border-neutral-200 dark:border-neutral-600 dark:hover:bg-neutral-600 transition-colors",
            activeEmailType === EmailTypes.Resend && "dark:bg-neutral-800"
          )}
        >
          <img className="size-16" src={`/img/providers/resend.svg`} />
          <div className="text-sm font-semibold text-center">Resend</div>
        </button>
        <button
          aria-selected={activeEmailType === EmailTypes.Sendgrid}
          onClick={() => setActiveEmailType(EmailTypes.Sendgrid)}
          className={cx(
            "flex flex-col gap-2 justify-around items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-lg border-neutral-200 dark:border-neutral-600 dark:hover:bg-neutral-600 transition-colors",
            activeEmailType === EmailTypes.Sendgrid && "dark:bg-neutral-800"
          )}
        >
          <img className="size-16" src={`/img/providers/sendgrid.svg`} />
          <div className="text-sm font-semibold text-center">Sendgrid</div>
        </button>
        <button
          aria-selected={activeEmailType === EmailTypes.Nodemailer}
          onClick={() => setActiveEmailType(EmailTypes.Nodemailer)}
          className={cx(
            "flex flex-col gap-2 justify-around items-center p-4 w-32 h-32 rounded-lg border border-solid shadow-lg border-neutral-200 dark:border-neutral-600 dark:hover:bg-neutral-600 transition-colors",
            activeEmailType === EmailTypes.Nodemailer && "dark:bg-neutral-800"
          )}
        >
          <img className="w-16 h-12" src={`/img/providers/nodemailer.svg`} />
          <div className="text-sm font-semibold text-center">Nodemailer</div>
        </button>
      </div>
      {activeEmailType === EmailTypes.Resend ? <ResendSetup /> : null}
      {activeEmailType === EmailTypes.Sendgrid ? <SendgridSetup /> : null}
      {activeEmailType === EmailTypes.Nodemailer ? <NodemailerSetup /> : null}
    </>
  )
}
