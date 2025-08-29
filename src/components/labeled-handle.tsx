import React, { forwardRef, type HTMLAttributes } from "react";
import { Handle, type HandleProps } from "reactflow";
import { cn } from "@/lib/utils";

const flexDirections = {
  top: "flex-col",
  right: "flex-row-reverse justify-end",
  bottom: "flex-col-reverse justify-end",
  left: "flex-row",
};

export const LabeledHandle = forwardRef<
  HTMLDivElement,
  HandleProps & HTMLAttributes<HTMLDivElement> & {
    title: string;
    handleClassName?: string;
    labelClassName?: string;
  }
>(
  (
    { className, labelClassName, handleClassName, title, position, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      title={title}
      className={cn(
        "relative flex items-center",
        flexDirections[position],
        className,
      )}
    >
      <Handle position={position} className={cn("!bg-gray-500", handleClassName)}  {...props} />
      <label className={cn("px-3 text-foreground", labelClassName)}>
        {title}
      </label>
    </div>
  ),
);

LabeledHandle.displayName = "LabeledHandle";
