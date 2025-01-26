import React, { useEffect, useRef, useState } from "react";
import { cn } from "../libs/common";
import { hachureFill, line, rectangle, SEED } from "../libs/wired";

import "../styles/custom-wired.css";
interface MediumDrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: number;
  display?: boolean;
}

const MediumDrawer = React.forwardRef<HTMLDivElement, MediumDrawerProps>(
  ({ className, elevation = 1, display = false, ...props }) => {
    const localRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [show, setShow] = useState(display);

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

    useEffect(() => {
      setShow(display);

      if (display) {
        animateShow();
      } else {
        animateHide();
      }
    }, [display]);

    function renderDrawHandDrawn() {
      if (!localRef.current || !svgRef.current) return;
      svgRef.current.innerHTML = "";
      // iS USING VARIANT OUTLINE

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

    function animateShow() {
      localRef.current?.animate(
        [
          { transform: "scale(0.8)", opacity: 0 }, // Start smaller and transparent
          { transform: "scale(1.1)", opacity: 1 }, // Overshoot to make it bouncy
          { transform: "scale(1)", opacity: 1 }, // Settle at final size
        ],
        {
          duration: 700, // Total animation duration
          easing: "cubic-bezier(0.68, -0.6, 0.32, 1.6)", // Bouncier easing
          fill: "forwards", // Keep the final state after animation
        }
      );
    }

    function animateHide() {
      localRef.current?.animate(
        [
          { transform: "scale(1)", opacity: 1 }, // Start at full size and fully visible
          { transform: "scale(1.1)", opacity: 0.5 }, // Slight overshoot for bounce
          { transform: "scale(0.8)", opacity: 0 }, // Shrink and fade out
        ],
        {
          duration: 700, // Total duration
          easing: "cubic-bezier(0.68, -0.6, 0.32, 1.6)", // Bouncy easing
          fill: "forwards", // Keep the final state after animation
        }
      );
    }

    return (
      <div
        ref={localRef}
        {...props}
        className={cn(
          className,
          "h-fit relative overflow-hidden transition-all"
        )}
      >
        <div className="absolute top-0 h-0 left-0 right-0 cursor-none z-0">
          <svg ref={svgRef} className="block"></svg>
        </div>
        {props.children}
      </div>
    );
  }
);

MediumDrawer.displayName = "MediumDrawer";
export default MediumDrawer;
