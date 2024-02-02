import { useEffect, useState } from "react";
import { List, Trigger, Root, Content } from "@radix-ui/react-tabs";
import type {
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TabsProps,
} from "@radix-ui/react-tabs";
import cx from "classnames";
import { useRouter } from "next/router";

RichTabs.List = function TabsList({ className, ...rest }: TabsListProps) {
  return (
    <List
      {...rest}
      className={cx("flex flex-row items-center justify-start", className)}
    />
  );
};

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
  );
};

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
  );
};

export function RichTabs({
  children,
  className,
  orientation = "horizontal",
  onTabChange,
  ...rest
}: TabsProps & { onTabChange?: (value: string) => void }) {
  const [tabValue, setTabValue] = useState(rest.defaultValue);
  const router = useRouter();
  const {
    query: { tab },
  } = router;

  useEffect(() => {
    setTabValue(
      Array.isArray(tab)
        ? tab[0]
        : typeof tab === "string" && tab.length > 0
        ? tab
        : rest.defaultValue
    );
  }, [tab]);

  function handleValueChanged(value: string) {
    setTabValue(value);
    if (onTabChange) {
      onTabChange(value);
    }
  }

  return (
    <Root
      className={cx("px-0 pt-4 m-0 rounded-lg mt-2", className)}
      orientation={orientation}
      {...rest}
      value={tabValue}
      onValueChange={handleValueChanged}
    >
      {children}
    </Root>
  );
}
