import { cva, VariantProps } from "class-variance-authority";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/libs/common";
import "@/styles/custom-wired.css";
import {
  generateSVGElevationSquare,
  hachureFill,
  rectangle,
  SEED,
} from "@/libs/wired";
import COLOR_THEME from "@/constants/color";
import clsx from "clsx";
import gsap from "gsap";
import { LoaderCircle } from "lucide-react";

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
   
    disabled:pointer-events-none 
    disabled:opacity-50 
    [&_svg]:pointer-events-none 
    [&_svg]:size-4 [&_svg]:shrink-0
  `,
  {
    variants: {
      variant: {
        default: "text-white  ",
        destructive: "text-white ",
        "outline-primary": "bg-primary-white text-primary-purple ",
        "outline-black": "bg-primary-white text-black ",
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
  loading?: boolean;
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
      loading = false,
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

    const BUTTON_SKETCH_DROP_SHADOW = {
      default:
        "hover:drop-shadow-[5px_5px_#3933a7] active:drop-shadow-none focus:drop-shadow-[5px_5px_#3933a7]",
      destructive: "",
      "outline-primary": "",
      "outline-black":
        "hover:drop-shadow-[5px_5px_#000000] active:drop-shadow-none focus:drop-shadow-[5px_5px_#000000]",
      secondary: "",
      ghost: "",
      third:
        "hover:drop-shadow-[5px_5px_#aa6f01] active:drop-shadow-none focus:drop-shadow-[5px_5px_#aa6f01]",
    };
    const localRef = useRef<HTMLButtonElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const contentRef = useRef<HTMLSpanElement>(null);
    const loadingRef = useRef<HTMLSpanElement>(null);

    const [lastSize, setLastSize] = useState({
      w: 0,
      h: 0,
    });

    const [localLoading, setLocalLoading] = useState(loading);

    useEffect(() => {
      if (!localRef.current && !svgRef.current) {
        return;
      }

      //FIRST DRAWN
      renderDrawHandDrawn();

      const resizeObserver = new ResizeObserver(() => {
        renderDrawHandDrawn();
      });

      resizeObserver.observe(localRef.current as Element);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    useEffect(() => {
      //ANIMATING
      // if (!loadingRef.current || !contentRef.current) return;
      // const tl = gsap.timeline();
      // console.log(loading, "dadadadad");
      // if (loading) {
      //   gsap.set(contentRef.current, {
      //     translateY: 0,
      //     autoAlpha: 1, // content is visible
      //   });

      //   gsap.set(loadingRef.current, {
      //     translateY: 20,
      //     autoAlpha: 0, // loading is hidden
      //   });

      //   tl.to(contentRef.current, {
      //     translateY: 20,
      //     autoAlpha: 0,
      //     duration: 0.2,
      //   });

      //   tl.to(loadingRef.current, {
      //     translateY: 0,
      //     autoAlpha: 1,
      //     duration: 0.2,
      //   });
      // }

      // if (!loading) {
      //   gsap.set(contentRef.current, {
      //     translateY: 20,
      //     autoAlpha: 0, // opacity: 0 + visibility: hidden
      //   });

      //   gsap.set(loadingRef.current, {
      //     translateY: 0,
      //     autoAlpha: 1, // opacity: 1 + visibility: visible
      //   });

      //   tl.to(loadingRef.current, {
      //     translateY: -20,
      //     autoAlpha: 0,
      //     duration: 0.2,
      //   });

      //   tl.to(contentRef.current, {
      //     translateY: 0,
      //     autoAlpha: 1,
      //     duration: 0.2,
      //   });
      // }

      setLocalLoading(loading);
    }, [loading]);

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
        disabled={props.disabled || localLoading}
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
          styleMode == "sketch" && "font-comic-neue",
          styleMode == "sketch" &&
            variant &&
            BUTTON_SKETCH_DROP_SHADOW[variant],
          "focus:outline-none focus:ring-0 outline-none",
          "transition-all hover:-translate-y-1.5  active:scale-95 active:translate-y-0 filter  focus:-translate-y-1.5"
        )}
        {...props}
      >
        <div className="absolute top-0 h-0 left-0 right-0 cursor-none z-0">
          <svg className="block svg-wired " ref={svgRef}></svg>
        </div>
        {/* <span ref={loadingRef} className={clsx("absolute z-20 ")}>
          <LoaderCircle className="animate-spin" />
        </span> */}
        <span ref={contentRef} className={clsx("relative z-20  ")}>
          {props.children}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
