import {
  Select,
  SelectProvider,
  SelectLabel,
  SelectPopover,
  SelectItem,
  SelectValue,
  SelectArrow,
} from "@ariakit/react"
import manifest from "@/data/manifest.json"
import { useEffect, useState } from "react"

function FrameworkSelect() {
  const defaultValue = manifest.frameworks[0].name
  const [value, setValue] = useState(defaultValue)
  useEffect(() => {
    setValue(localStorage.getItem("framework") ?? defaultValue)
  }, [])
  return (
    <SelectProvider
      defaultValue={defaultValue}
      setValue={(e) => {
        localStorage.setItem("framework", e)
        setValue(e)
      }}
      value={value}
    >
      <SelectLabel hidden>
        <small>Integration</small>
      </SelectLabel>
      <Select className="flex w-full items-center justify-between">
        <SelectValue fallback="Select a value">
          {(value) => (
            <div className="flex gap-1">
              <img
                className="inline"
                src={`/img/etc/${manifest.frameworks.find((f) => f.name === value)?.id}.svg`}
                alt={value}
                width={12}
                height={12}
              />
              {value}
            </div>
          )}
        </SelectValue>
        <SelectArrow />
      </Select>
      <SelectPopover className="bg-white dark:bg-black" gutter={4}>
        {manifest.frameworks.map((framework) => (
          <SelectItem
            key={framework.name}
            value={framework.name}
            className={`flex gap-2 p-2 hover:bg-orange-200 hover:dark:bg-orange-500 ${framework.name === value ? "bg-orange-200 dark:bg-orange-500" : ""}`}
          >
            <img
              className="inline"
              src={`/img/etc/${framework.id}.svg`}
              alt={framework.name}
              width={12}
              height={12}
            />
            {framework.name}
          </SelectItem>
        ))}
      </SelectPopover>
    </SelectProvider>
  )
}
export default {
  "-- Framework Selector": {
    title: <FrameworkSelect />,
    type: "separator",
  },
  index: {
    title: "Introduction",
    theme: {
      typesetting: "article",
    },
  },
  "migrate-to-better-auth": {
    title: "Migrate to Better Auth",
  },
  "-- getting-started": {
    type: "separator",
    title: "Getting Started",
  },
  installation: "Installation",
  authentication: {
    title: "Authentication",
    theme: {
      toc: false,
    },
  },
  database: "Database",
  "session-management": {
    title: "Session Management",
    theme: {
      toc: false,
    },
  },
  deployment: "Deployment",
  typescript: "TypeScript",
  "-- connect": {
    type: "separator",
    title: "Connections",
  },
  providers: "Providers",
  adapters: "Adapters",
  integrations: {
    title: "Integrations",
    theme: {
      typesetting: "article",
    },
  },
}
