import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  action?: ReactNode;
};

export default function Input({id, label, action, className = "", ...props}: InputProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-primary">
          {label}
        </label>
        {action}
      </div>
      <input
        id={id}
        className={`mt-2 w-full rounded-lg border border-card-border bg-card px-4 py-2.5 text-sm text-primary placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent ${className}`}
        {...props}
      />
    </div>
  );
}
