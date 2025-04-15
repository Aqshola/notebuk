import { cva, VariantProps } from "class-variance-authority";
import React, { LegacyRef, useEffect, useRef, useState } from "react";
import { cn } from "../libs/common";
import "../styles/custom-wired.css";
import {
  generateSVGElevationSquare,
  hachureFill,
  line,
  rectangle,
  SEED,
} from "../libs/wired";
import COLOR_THEME from "../constants/color";

const buttonVariants = cva(
  `
    active:scale-95
    relative 
    wired-rendered
    inline-flex items-center justify-center 
    gap-2 whitespace-nowrap 
    rounded-md text-sm 
    font-medium ring-offset-background 
    transition-colors
    transition-transform 
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
        default: "text-white  hover:bg-primary-purple/90",
        destructive: "text-white hover:bg-primary-red/90",
        "outline-primary":
          "bg-primary-white text-primary-purple hover:bg-primary-purple/10",
        "outline-black":
          "bg-primary-white text-black hover:bg-primary-purple/10",
        secondary: "text-white  hover:bg-secondary/80",
        third: "text-black  hover:bg-secondary/80",
        ghost: "",
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
  elevation?: number;
  styleMode?: "solid" | "sketch";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size,
      asChild = false,
      elevation = 1,
      styleMode = "solid",
      ...props
    },
    ref
  ) => {
    const BUTTON_FILL_SOLID_COLOR = {
      default: "bg-primary-purple",
      destructive: "bg-primary-red",
      "outline-primary": "border border-primary-purple",
      "outline-black": "border border-black",
      secondary: "bg-primary-green",
      ghost: "bg-primary-white",
      third: "bg-primary-yellow",
    };

    const BUTTON_FILL_SKETCH_COLOR = {
      default: COLOR_THEME.primary.PURPLE,
      destructive: COLOR_THEME.primary.RED,
      "outline-primary": COLOR_THEME.primary.PURPLE,
      "outline-black": COLOR_THEME.primary.BLACK,
      secondary: COLOR_THEME.primary.GREEN,
      third: COLOR_THEME.primary.YELLOW,
      ghost: COLOR_THEME.primary.WHITE,
    };
    const localRef = useRef<HTMLButtonElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [lastSize, setLastSize] = useState({
      w: 0,
      h: 0,
    });

    useEffect(() => {
      if (!localRef.current && !svgRef.current) {
        return;
      }

      //FIRST DRAWN
      renderDrawHandDrawn();

      const resizeObserver = new ResizeObserver(() => {
        console.log("didi");
        renderDrawHandDrawn();
      });

      resizeObserver.observe(localRef.current as Element);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    function renderDrawHandDrawn() {
      if (!variant) return;
      if (styleMode == "solid") return;
      if (!localRef.current || !svgRef.current) return;
      // iS USING VARIANT OUTLINE
      const isOutline = variant?.includes("outline");
      svgRef.current.innerHTML = "";

      //CALCULATE WIDTH AND HEADING
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

      if (!isOutline) {
        const fillNode = hachureFill(
          [
            [2, 2],
            [s.width - 4, 2],
            [s.width - 2, s.height - 4],
            [2, s.height - 4],
          ],
          SEED
        );
        fillNode.classList.add("cardFill");
        svgRef.current.style.setProperty(
          "--wired-card-background-fill",
          BUTTON_FILL_SKETCH_COLOR[variant]
        );
        svgRef.current.appendChild(fillNode);
      }

      if (isOutline && variant) {
        svgRef.current.style.color = BUTTON_FILL_SKETCH_COLOR[variant];
        rectangle(svgRef.current, 0, 0, s.width, s.height, SEED);
        generateSVGElevationSquare(svgRef.current, elev, s);
      }
    }

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

    return (
      <button
        ref={(parameterRef) => {
          if (!parameterRef) return;
          if (typeof ref === "function") {
            ref(parameterRef);
          }
          // If ref is a MutableRefObject
          else if (ref) {
            (ref as React.MutableRefObject<HTMLButtonElement>).current =
              parameterRef;
          }
          (localRef as React.MutableRefObject<HTMLButtonElement>).current =
            parameterRef;
        }}
        className={cn(
          buttonVariants({ variant, size, className }),
          styleMode === "solid" && variant && BUTTON_FILL_SOLID_COLOR[variant],
          styleMode == "solid" && "font-poppins",
          styleMode == "sketch" && "font-comic-neue"
        )}
        {...props}
      >
        <div className="absolute top-0 h-0 left-0 right-0 cursor-none z-0">
          <svg className="block svg-wired" ref={svgRef}></svg>
        </div>
        <span className="relative z-30">{props.children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
