import React, { useContext, useEffect, useRef, useState } from "react";
import { SwitchTransition, Transition } from "react-transition-group";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import useTransitionStore from "../../stores/transitionStore";

interface Props {
  children: React.ReactNode;
}
const TransitionComponent = ({ children }: Props) => {
  const location = useLocation();
  const { setComplete } = useTransitionStore((state) => state);
  const bgRef = useRef<HTMLDivElement>(null);
  const [positionBg, setPositionBg] = useState({
    start: "-100%",
    end: "100%",
  });

  return (
    <>
      <div
        ref={bgRef}
        className="bg-primary-purple fixed -translate-x-[100%] z-50 w-screen h-screen top-0"
      ></div>
      <SwitchTransition>
        <Transition
          key={location.pathname}
          timeout={500}
          onEnter={(node: any) => {
            gsap
              .timeline({
                paused: true,
                onComplete: () => {
                  setComplete(true);

                  if (positionBg.end == "100%") {
                    setPositionBg({
                      end: "-100%",
                      start: "100%",
                    });
                  } else {
                    setPositionBg({
                      start: "-100%",
                      end: "100%",
                    });
                  }
                },
              })
              .to(bgRef.current, { translateX: positionBg.end })
              .to(node, { opacity: 100, duration: 0.3 })
              .play();
          }}
          onExit={(node) => {
            gsap.set(bgRef.current, { translateX: positionBg.start });
            gsap
              .timeline({ paused: true })
              .to(bgRef.current, { translateX: "0" })
              .to(node, { opacity: 0 })
              .play();
          }}
        >
          {children}
        </Transition>
      </SwitchTransition>
    </>
  );
};

export default TransitionComponent;
