import React from "react";
import cx from "classnames";
import { Option, useTokenAuthInstructions } from "./useTokenAuthInstructions";
import { ChatCircleDots, EnvelopeSimpleOpen } from "@phosphor-icons/react";
// @ts-expect-error - Typescript does not like MDX imports, but it works
import EmailProviderSetup from "./content/EmailProviderSetup.mdx";
import { Tooltip } from "../Tooltip";

const styles = {
  base: "p-4 border border-solid dark:border-neutral-800 border-slate-200 rounded-lg flex flex-col items-center gap-2 justify-center w-32 shadow-lg h-32 dark:border-slate-600 dark:hover:bg-slate-600",
  selected: "aria-selected:border-1 aria-selected:border-fuchsia-400",
  disabled: "opacity-50 cursor-not-allowed",
};

export function TokenAuthInstructions() {
  const { selected } = useTokenAuthInstructions();
  const cardStyles = cx(styles.base, styles.selected);

  const content = selected === Option.Email ? <EmailProviderSetup /> : null;

  return (
    <>
      <div className="mt-3 flex flex-row gap-4 pb-3">
        <div
          role="button"
          aria-selected={selected === Option.Email}
          className={cardStyles}
        >
          <EnvelopeSimpleOpen fontSize="3rem" color="#37474F" />
          <div className="text-sm text-center font-semibold">Nodemailer</div>
        </div>
        <Tooltip label="Coming soon &nbsp;👀">
          <div
            role="button"
            aria-disabled="true"
            aria-selected={selected === Option.OTP}
            className={cx(cardStyles, "gap-3", styles.disabled)}
          >
            <ChatCircleDots fontSize="2.8rem" color="#37474F" />
            <div className="text-sm text-center font-semibold">Resend</div>
          </div>
        </Tooltip>
      </div>
      {content}
    </>
  );
}
