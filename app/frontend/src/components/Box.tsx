import { cva, VariantProps } from "class-variance-authority";
import React, { LegacyRef, useEffect, useRef, useState } from "react";
import { cn } from "../libs/common";
import "../styles/custom-wired.css";
import { hachureFill, line, rectangle, SEED } from "../libs/wired";
import COLOR_THEME from "../constants/color";
import clsx from "clsx";

interface MediumDrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: number;
  display?: boolean;
}

const Box = React.forwardRef<HTMLDivElement, MediumDrawerProps>(
  (
    {
      className,

      elevation = 1,

      ...props
    },
    ref
  ) => {
    const localRef = useRef<HTMLDivElement>(null);
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
        renderDrawHandDrawn();
      });

      resizeObserver.observe(localRef.current as Element);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    function renderDrawHandDrawn() {
      if (!localRef.current || !svgRef.current) return;
      svgRef.current.innerHTML = "";
      const size = localRef.current.getBoundingClientRect();
      const elev = Math.min(Math.max(1, elevation), 5);
      const w = size.width + (elev - 1) * 2;
      const h = size.height + (elev - 1) * 2;

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
      <div
        ref={(parameterRef) => {
          if (!parameterRef) return;
          if (typeof ref === "function") {
            ref(parameterRef);
          }
          // If ref is a MutableRefObject
          else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement>).current =
              parameterRef;
          }
          (localRef as React.MutableRefObject<HTMLDivElement>).current =
            parameterRef;
        }}
        className={clsx("relative", className)}
        {...props}
      >
        <div className="absolute top-0 h-0 left-0 right-0 z-0">
          <svg className="block svg-wired" ref={svgRef}></svg>
        </div>
        <div className="relative z-30">{props.children}</div>
      </div>
    );
  }
);

Box.displayName = "Box";
export default Box;
