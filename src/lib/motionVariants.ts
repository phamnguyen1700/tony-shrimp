import type { Variants, Transition } from 'motion/react'

export const springFast: Transition = { type: 'spring', stiffness: 400, damping: 35 }
export const springSmooth: Transition = { type: 'spring', stiffness: 200, damping: 30 }
export const springMedium: Transition = { type: 'spring', stiffness: 260, damping: 28 }
export const springGentle: Transition = { type: 'spring', stiffness: 120, damping: 24 }

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0 },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
}

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
}

export const scaleUp: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: springFast },
  tap: { scale: 0.97, transition: springFast },
}

export const buttonTap: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.97 },
}

export const shrimpFloat: Variants = {
  rest: { y: 0, rotate: 0 },
  float: {
    y: [0, -8, -2, -10, 0],
    rotate: [0, 0.8, -0.5, 1.2, 0],
    transition: {
      duration: 7,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
}

export const maskReveal: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export const drawerSlide: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: springSmooth },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } },
}

export const modalScale: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: springFast },
  exit: { opacity: 0, scale: 0.97, y: 4, transition: { duration: 0.18, ease: 'easeIn' } },
}

export const bottomSheetSlide: Variants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: springSmooth },
  exit: { y: '100%', transition: { duration: 0.22, ease: 'easeIn' } },
}
