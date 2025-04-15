import React, { useContext } from "react";
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
  return (
    <SwitchTransition>
      <Transition
        key={location.pathname}
        timeout={500}
        onEnter={(node: any) => {
          setComplete(false);
          gsap.set(node, { autoAlpha: 0, xPercent: -100 });
          gsap
            .timeline({
              paused: true,
              onComplete: () => setComplete(true),
            })
            .to(node, { autoAlpha: 1, xPercent: 0, duration: 0.25 })
            .to(node, { duration: 0.25 })
            .play();
        }}
        onExit={(node) => {
          gsap
            .timeline({ paused: true })
            .to(node, { duration: 0.2 })
            .to(node, { xPercent: 100, autoAlpha: 0, duration: 0.2 })
            .play();
        }}
      >
        {children}
      </Transition>
    </SwitchTransition>
  );
};

export default TransitionComponent;
