"use client"

// From Fumadocs: https://github.com/fuma-nama/fumadocs/blob/dev/packages/ui/src/components/accordion.tsx

import * as AccordionPrimitive from "@radix-ui/react-accordion"
import type {
  AccordionMultipleProps,
  AccordionSingleProps,
} from "@radix-ui/react-accordion"
import { Check, Link, CaretRight } from "@phosphor-icons/react"
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  useState,
  useEffect,
} from "react"
import { useCopyButton } from "@/utils/useCopyButton"
import cx from "classnames"

export const Accordions = forwardRef<
  HTMLDivElement,
  AccordionSingleProps | AccordionMultipleProps
>((props, ref) => {
  if (props.type === "multiple") {
    return <MultipleAccordions className="bg-red-500" ref={ref} {...props} />
  }

  return (
    <SingleAccordions
      ref={ref}
      {...props}
      // If type is undefined
      type="single"
    />
  )
})

Accordions.displayName = "Accordions"

export const MultipleAccordions = forwardRef<
  HTMLDivElement,
  AccordionMultipleProps
>(({ className, defaultValue, ...props }, ref) => {
  const [defValue, setDefValue] = useState(defaultValue)
  const value = props.value ?? defValue
  const setValue = props.onValueChange?.bind(props) ?? setDefValue

  useEffect(() => {
    if (window.location.hash.length > 0)
      setValue([window.location.hash.substring(1)])
  }, [setValue])

  return (
    <AccordionPrimitive.Root
      ref={ref}
      value={value}
      onValueChange={setValue}
      className={cx(className, "mt-2 border-2 *:bg-neutral-700")}
      {...props}
    />
  )
})

MultipleAccordions.displayName = "MultipleAccordions"

export const SingleAccordions = forwardRef<
  HTMLDivElement,
  AccordionSingleProps
>(({ className, defaultValue, ...props }, ref) => {
  const [defValue, setDefValue] = useState(defaultValue)
  const value = props.value ?? defValue
  const setValue = props.onValueChange?.bind(props) ?? setDefValue

  useEffect(() => {
    if (window.location.hash.length > 0)
      setValue(window.location.hash.substring(1))
  }, [setValue])

  return (
    <AccordionPrimitive.Root
      ref={ref}
      value={value}
      onValueChange={setValue}
      collapsible
      className={cx(
        className,
        "mt-4 border-2 border-neutral-100 dark:border-neutral-800 rounded-lg"
      )}
      {...props}
    />
  )
})

SingleAccordions.displayName = "SingleAccordions"

export const Accordion = forwardRef<
  HTMLDivElement,
  Omit<ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>, "value"> & {
    title: string
  }
>(({ title, className, children, ...props }, ref) => {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      // Use `id` instead if presents
      value={props.id ?? title}
      className={cx(
        "group/accordion scroll-m-20 border-b-2 border-neutral-100 dark:border-neutral-800 p-1 last-of-type:border-b-0",
        className
      )}
      {...props}
    >
      <AccordionPrimitive.Header
        asChild
        className="flex items-center rounded-lg not-prose text-medium text-muted-foreground"
      >
        <>
          <AccordionPrimitive.Trigger className="flex gap-1 items-center py-4 w-full text-left focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-ring">
            <CaretRight className="size-5 transition-transform duration-200 group-data-[state=open]/accordion:rotate-90" />
            <span className="font-medium text-medium text-foreground">
              {title}
            </span>
          </AccordionPrimitive.Trigger>
          {props.id ? <CopyButton id={props.id} /> : null}
        </>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="pb-4 pl-6 text-sm prose-no-margin">{children}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
})

function CopyButton({ id }: { id: string }): JSX.Element {
  const [checked, onClick] = useCopyButton(() => {
    const url = new URL(window.location.href)
    url.hash = id

    void navigator.clipboard.writeText(url.toString())
  })

  return (
    <button
      type="button"
      aria-label="Copy Link"
      className="hover:bg-accent hover:text-accent-foreground opacity-0 transition-all group-data-[state=open]/accordion:opacity-100"
      onClick={onClick}
    >
      {checked ? <Check className="size-3.5" /> : <Link className="size-3.5" />}
    </button>
  )
}

Accordion.displayName = "Accordion"
