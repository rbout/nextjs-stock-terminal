import type { InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> & {
  id: string;
  label: string;
};

export default function Checkbox({id, label, className = "", ...props}: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 text-sm text-primary"
    >
      <input
        id={id}
        type="checkbox"
        className={`cursor-pointer h-4 w-4 rounded accent-accent focus:outline-none ${className}`}
        {...props}
      />
      {label}
    </label>
  );
}
