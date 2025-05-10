import clsx from "clsx";
import { ClassValue } from "clsx";
import React, { FormEvent } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mappingErrorFetch() {}

export function handleInputOnlyNumber(
  event: FormEvent<HTMLInputElement> | Event
): void {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/[^0-9]/g, "");
}

export function skipFocus(e: React.FocusEvent, query: string) {
  const button = e.currentTarget.querySelector(query);

  // Check if the element is focusable
  if (button && isFocusable(button)) {
    (button as HTMLElement).focus(); // Type assertion here
  }
}

// Helper function to check if an element is focusable
function isFocusable(element: Element) {
  const focusableElements = [
    "A",
    "BUTTON",
    "INPUT",
    "TEXTAREA",
    "SELECT",
    "DETAILS",
  ];
  return (
    focusableElements.includes(element.tagName) ||
    element.hasAttribute("tabindex")
  );
}
