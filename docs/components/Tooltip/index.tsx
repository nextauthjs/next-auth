import React from "react";
import { Tooltip as ArkTooltip } from "@ark-ui/react";

interface Props {
  label: string;
  children: React.ReactNode;
}

export function Tooltip({ label, children }: Props) {
  return (
    <ArkTooltip.Root
      positioning={{ placement: "bottom" }}
      openDelay={0}
      lazyMount
      unmountOnExit
    >
      <ArkTooltip.Trigger asChild={true}>{children}</ArkTooltip.Trigger>
      <ArkTooltip.Positioner>
        <ArkTooltip.Content
          className="bg-purple-100 rounded-lg text-fuchsia-900 px-4 py-2 text-sm max-w-xs text-center shadow-md  border"
          style={{ animation: "	animation: fadeIn .2s linear" }}
        >
          {label}
        </ArkTooltip.Content>
      </ArkTooltip.Positioner>
    </ArkTooltip.Root>
  );
}
