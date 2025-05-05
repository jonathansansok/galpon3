import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  className?: string;
}

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg ${className}`}
    />
  );
}