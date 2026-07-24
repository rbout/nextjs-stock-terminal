import type { ComponentPropsWithoutRef, ElementType } from "react";

type CardProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

export default function Card<T extends ElementType = "div">({as, className = "", ...props}: CardProps<T>) {
  const Tag = as || "div";
  return (
    <Tag
      className={`rounded-2xl border border-card-border bg-card ${className}`}
      {...props}
    />
  );
}
