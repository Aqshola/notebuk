import clsx from "clsx";
import { ClassValue } from "clsx";
import { FormEvent } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]){
    return twMerge(clsx(inputs))
}

export function mappingErrorFetch(){
    
}

export function handleInputOnlyNumber(event: FormEvent<HTMLInputElement>|Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }