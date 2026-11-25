import type { Transition, Variants } from "framer-motion";

export const CARD_SPRING: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const LUXURY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const heroFadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay,
      ease: LUXURY_EASE,
    },
  }),
};

export const portraitReveal: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.15,
      ease: LUXURY_EASE,
    },
  },
};
