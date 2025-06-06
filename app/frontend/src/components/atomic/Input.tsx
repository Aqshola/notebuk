import React, { useRef, useEffect, forwardRef } from "react";
import { generateSVGElevationSquare, rectangle, SEED } from "../../libs/wired";
import clsx from "clsx";

const Input = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const defaultStyle =
      "flex font-comic-neue h-10 w-full rounded-md  px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium   focus-visible:outline-none    disabled:cursor-not-allowed disabled:opacity-50 md:text-sm z-30";

    const localRef = useRef<HTMLInputElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

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

    // function renderDrawHandDrawn() {
    //   if (!localRef.current || !svgRef.current) return;
    //   svgRef.current.innerHTML = "";
    //   const size = localRef.current.getBoundingClientRect();
    //   const elev = 1;
    //   const w = size.width + (elev - 1) * 2;
    //   const h = size.height + (elev - 1) * 2;

    //   svgRef.current.style.width = `${w}`;
    //   svgRef.current.style.height = `${h}`;

    //   const s = {
    //     width: w - (elev - 1) * 2,
    //     height: h - (elev - 1) * 2,
    //   };

    //   rectangle(svgRef.current, 0, 0, s.width, s.height, SEED);


    //  }

     function renderDrawHandDrawn() {
      const svgElement = svgRef.current;
      const inputElement = localRef.current;
      if (!svgElement || !inputElement) {
        return;
      }
      const rect = inputElement.getBoundingClientRect();
      
      svgRef.current.style.width = `${rect.width}`;
      svgRef.current.style.height = `${rect.height}`;

      svgElement.innerHTML = ""; // Clear previous SVG content
      rectangle(svgElement, 2, 2, rect.width, rect.height, SEED);
    } 
    return (
      <div className="relative w-full transition-all focus-within:-translate-y-1 focus-within:shadow-[5px_5px_#000000]">
        <input
          ref={(parameterRef) => {
            if (!parameterRef) return;
            if (typeof ref === "function") {
              ref(parameterRef);
            }
            // If ref is a MutableRefObject
            else if (ref) {
              (ref as React.MutableRefObject<HTMLInputElement>).current =
                parameterRef;
            }
            (localRef as React.MutableRefObject<HTMLInputElement>).current =
              parameterRef;
          }}
          className={clsx(
            className,
            defaultStyle,
            "z-30 relative bg-transparent w-full focus:ring-0 focus:outline-none outline-none ring-0",
            "drop-shadow-primary-yellow"
          )}
          type={type}
          {...props}
        />
        <div className="absolute top-0 h-0 left-0 right-0 z-0">
          <svg
            ref={svgRef}
            className="svg-wired drop-shadow-primary-yellow"
          ></svg>
        </div>
      </div>
    );
  }
);

export default Input;
