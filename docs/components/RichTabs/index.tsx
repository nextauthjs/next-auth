import { List, Trigger, Root, Content } from "@radix-ui/react-tabs"
import type {
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TabsProps,
} from "@radix-ui/react-tabs"
import cx from "classnames"
import { useRichTabs } from "./useRichTabs"
import { useState } from "react"

RichTabs.List = function TabsList({ className, ...rest }: TabsListProps) {
  return (
    <List
      {...rest}
      className={cx("flex flex-row items-center justify-start", className)}
    />
  )
}

RichTabs.Trigger = function TabsTrigger({
  className,
  orientation = "horizontal",
  ...rest
}: TabsTriggerProps & { orientation?: TabsProps["orientation"] }) {
  return (
    <Trigger
      {...rest}
      className={cx(
        "relative font-semibold dark:bg-neutral-900 bg-slate-50 text-sm border-solid dark:border-neutral-800 border-slate-200  flex flex-col items-center justify-between w-48 h-24 dark:aria-selected:bg-neutral-700 transition-all duration-300 aria-selected:bg-white aria-selected:top-px",
        className,
        orientation === "horizontal"
          ? "aria-selected:border-b-white rounded-tl-lg rounded-tr-lg border-l border-t border-r "
          : "rounded-md"
      )}
    />
  )
}

RichTabs.Content = function TabsContent({
  className,
  orientation = "horizontal",
  ...rest
}: TabsContentProps & { orientation?: TabsProps["orientation"] }) {
  return (
    <Content
      forceMount
      {...rest}
      className={cx(
        'data-[state="inactive"]:hidden border border-solid dark:border-neutral-800 border-slate-200 shadow-sm',
        className,
        orientation === "horizontal"
          ? "rounded-bl-lg rounded-br-lg rounded-tr-lg"
          : "rounded-md"
      )}
    />
  )
}

type Props = TabsProps & { onTabChange?: (value: string) => void } & {
  defaultValue: string
  tabKey?: string
}

export function RichTabs({
  children,
  className,
  orientation = "horizontal",
  defaultValue,
  onTabChange,
  tabKey,
}: Props) {
  const [value, setValue] = useState<string>(defaultValue)
  const { handleValueChanged } = useRichTabs({
    onTabChange,
    value,
    setValue,
    defaultValue,
    tabKey,
  })

  return (
    <Root
      className={cx("px-0 pt-4 m-0 rounded-lg mt-2", className)}
      orientation={orientation}
      onValueChange={handleValueChanged}
      value={value}
    >
      {children}
    </Root>
  )
}
