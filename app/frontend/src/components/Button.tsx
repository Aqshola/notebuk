import { cva, VariantProps } from "class-variance-authority";
import React, { LegacyRef, useEffect, useRef, useState } from "react";
import { cn } from "../libs/common";
import "../styles/custom-wired.css";
import { line, rectangle, SEED } from "../libs/wired";

const buttonVariants = cva(
  `
    relative 
    wired-rendered
    inline-flex items-center justify-center 
    gap-2 whitespace-nowrap 
    rounded-md text-sm 
    font-medium ring-offset-background 
    transition-colors 
    focus-visible:outline-none 
    focus-visible:ring-2 
    focus-visible:ring-ring 
    focus-visible:ring-offset-2 
    disabled:pointer-events-none 
    disabled:opacity-50 
    [&_svg]:pointer-events-none 
    [&_svg]:size-4 [&_svg]:shrink-0
  `,
  {
    variants: {
      variant: {
        default: "",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const localRef = useRef<HTMLButtonElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const elevation = 1;
    const [lastSize, setLastSize] = useState({
      w: 0,
      h: 0,
    });
    useEffect(() => {
      if (!localRef.current && !svgRef.current) {
        return;
      }

      const resizeObserver = new ResizeObserver(() => {
        renderDrawHandDrawn();
      });

      resizeObserver.observe(localRef.current as Element);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    if (asChild) {
      return (
        <slot className={cn(buttonVariants({ variant, size, className }))}>
          <div>
            <svg></svg>
          </div>
          {props.children}
        </slot>
      );
    }

    function renderDrawHandDrawn() {
      if (!localRef.current || !svgRef.current) return;

      const size = localRef.current.getBoundingClientRect();
      const elev = Math.min(Math.max(1, elevation), 5);
      const w = size.width + (elev - 1) * 2;
      const h = size.height + (elev - 1) * 2;

      if (w == lastSize.w && h == lastSize.h) return;

      svgRef.current.style.width = `${w}`;
      svgRef.current.style.height = `${h}`;

      setLastSize({ w, h });

      const s = {
        width: w - (elev - 1) * 2,
        height: h - (elev - 1) * 2,
      };

      rectangle(svgRef.current, 0, 0, s.width, s.height, SEED);
      for (let i = 1; i < elev; i++) {
        line(
          svgRef.current,
          i * 2,
          s.height + i * 2,
          s.width + i * 2,
          s.height + i * 2,
          SEED
        ).style.opacity = `${(75 - i * 10) / 100}`;
        line(
          svgRef.current,
          s.width + i * 2,
          s.height + i * 2,
          s.width + i * 2,
          i * 2,
          SEED
        ).style.opacity = `${(75 - i * 10) / 100}`;
        line(
          svgRef.current,
          i * 2,
          s.height + i * 2,
          s.width + i * 2,
          s.height + i * 2,
          SEED
        ).style.opacity = `${(75 - i * 10) / 100}`;
        line(
          svgRef.current,
          s.width + i * 2,
          s.height + i * 2,
          s.width + i * 2,
          i * 2,
          SEED
        ).style.opacity = `${(75 - i * 10) / 100}`;
      }
    }

    return (
      <button
        ref={(parameterRef) => {
          if (!parameterRef) return;
          ref = ref;
          (localRef as React.MutableRefObject<HTMLButtonElement>).current =
            parameterRef;
        }}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        <div className=" absolute top-0 h-0 left-0 right-0 cursor-none">
          <svg className="block" ref={svgRef}></svg>
        </div>
        {props.children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
