import React from "react";
import { FieldError } from "react-hook-form";

interface Props {
  children: React.ReactNode;
  error?: FieldError;
}

export default function FormField(props: Props) {
  return (
    <div className="flex flex-col gap-2">
      {props.children}
      {props.error && (
        <span className="font-comic-neue text-red-500 font-medium">
          {props.error.message}
        </span>
      )}
    </div>
  );
}
