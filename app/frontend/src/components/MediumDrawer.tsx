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
    const animateRef = useRef<Animation | null>(null);
    const localRef = useRef<HTMLDivElement>(null);
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

    useEffect(() => {
      if (display) {
        animateShow();
      } else {
        animateHide();
      }

      return () => {
        if (animateRef.current) {
          animateRef.current.cancel();
        }
      };
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

      svgRef.current.style.width = `${w}`;
      svgRef.current.style.height = `${h}`;

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
      if (!localRef.current) return;
      const element = localRef.current;
      element.style.display = "block";

      const targetHeight = element.scrollHeight;

      const animate = element.animate(
        [
          {
            height: "0px",
            opacity: 0,
          },
          {
            height: `${targetHeight * 1.1}px`, // Reduced overshoot to 110%
            opacity: 1,
            offset: 0.6,
          },
          {
            height: `${targetHeight * 0.85}px`, // More gentle undershoot
            opacity: 1,
            offset: 0.75,
          },
          {
            height: `${targetHeight * 1.02}px`, // Tiny overshoot
            opacity: 1,
            offset: 0.9,
          },
          {
            height: `${targetHeight}px`, // Final height
            opacity: 1,
          },
        ],
        {
          duration: 1000,
          easing: "cubic-bezier(0.2, -0.6, 0.1, 1.6)", // Slightly less extreme bezier
          fill: "forwards",
        }
      );

      animateRef.current = animate;
    }

    function animateHide() {
      if (!localRef.current) return;

      const element = localRef.current;
      const startHeight = element.offsetHeight;

      const animate = element.animate(
        [
          {
            maxHeight: `${startHeight}px`,
            transform: "translateY(0)",
            opacity: 1,
          },
          {
            maxHeight: "0px",
            transform: "translateY(-10px)",
            opacity: 0,
          },
        ],
        {
          duration: 800,
          easing: "cubic-bezier(0.36, 0, 0.1, 1.5)",
          fill: "forwards",
        }
      );

      animate.addEventListener("finish", () => {
        element.style.display = "none";
      });
      animateRef.current = animate;
    }

    return (
      <div
        ref={localRef}
        {...props}
        className={cn(className, "relative  transition-all  overflow-hidden")}
      >
        <div className="absolute top-0 h-0 left-0 right-0 cursor-none z-0">
          <svg ref={svgRef} className="block"></svg>
        </div>
        <div className="w-full p-4">{props.children}</div>
      </div>
    );
  }
);

MediumDrawer.displayName = "MediumDrawer";
export default MediumDrawer;
