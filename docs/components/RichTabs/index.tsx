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
        "relative flex h-24 w-48 flex-col items-center justify-between border-solid  border-slate-200 bg-slate-50 text-sm font-semibold transition-all duration-300 aria-selected:top-px aria-selected:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:aria-selected:bg-neutral-700",
        className,
        orientation === "horizontal"
          ? "rounded-tl-lg rounded-tr-lg border-l border-r border-t aria-selected:border-b-white "
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
        'border border-solid border-slate-200 shadow-sm data-[state="inactive"]:hidden dark:border-neutral-800',
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
      className={cx("m-0 mt-2 rounded-lg px-0 pt-4", className)}
      orientation={orientation}
      onValueChange={handleValueChanged}
      value={value}
    >
      {children}
    </Root>
  )
}
