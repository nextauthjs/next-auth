import React from "react";
import { useListDisclosure } from "./useListDisclosure";
import cx from "classnames";

interface Props {
  children: React.ReactElement[];
  limit: number;
  className?: string;
}

export function ListDisclosure({ children, limit, className = "" }: Props) {
  const { displayLimit, handleCollapseAll, handleDisplayMore } =
    useListDisclosure(limit);

  const rendered = children.slice(0, displayLimit);
  const isAllDisplayed = displayLimit >= children.length;

  return (
    <>
      <div
        className={cx(
          "grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 w-full my-4",
          className
        )}
      >
        {rendered}
      </div>
      <button
        className="w-24 h-8 text-sm font-semibold text-white rounded-full shadow-md bg-slate-900"
        onClick={isAllDisplayed ? handleCollapseAll : handleDisplayMore}
      >
        {isAllDisplayed ? "Collapse all" : "Show more"}
      </button>
    </>
  );
}
