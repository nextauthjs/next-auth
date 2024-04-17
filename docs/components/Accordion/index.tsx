"use client"

// From Fumadocs: https://github.com/fuma-nama/fumadocs/blob/dev/packages/ui/src/components/accordion.tsx

import * as AccordionPrimitive from "@radix-ui/react-accordion"
import type {
  AccordionMultipleProps,
  AccordionSingleProps,
} from "@radix-ui/react-accordion"
import { Check, Link, CaretRight } from "@/icons"
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
      className={className}
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
        "mt-4 border border-neutral-200 dark:border-neutral-800 rounded-lg"
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
        "group/accordion scroll-m-20 border-b border-neutral-200 dark:border-neutral-800 last-of-type:border-b-0 first:rounded-t-lg first:overflow-hidden last:overflow-hidden last:rounded-b-lg",
        className
      )}
      {...props}
    >
      <>
        <AccordionPrimitive.Trigger className="flex gap-1 items-center py-[1.125rem] px-2 w-full text-left focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-ring data-[state=open]:bg-neutral-100 data-[state=open]:dark:bg-neutral-950 transition-colors duration-300">
          <CaretRight className="size-4 transition-transform duration-200 group-data-[state=open]/accordion:rotate-90" />
          <span className="font-medium text-medium text-foreground">
            {title}
          </span>
        </AccordionPrimitive.Trigger>
        {props.id ? <CopyButton id={props.id} /> : null}
      </>
      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="py-4 pl-6 text-sm prose-no-margin">{children}</div>
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
