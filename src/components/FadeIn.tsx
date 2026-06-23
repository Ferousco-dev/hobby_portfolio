import { motion, type Variants } from 'framer-motion'
import { type ElementType, type ReactNode, useMemo } from 'react'

interface FadeInProps {
  children: ReactNode
  as?: ElementType
  delay?: number
  duration?: number
  x?: number
  y?: number
  className?: string
  style?: React.CSSProperties
}

const EASE = [0.25, 0.1, 0.25, 1] as const

export default function FadeIn({
  children,
  as = 'div',
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  style,
}: FadeInProps) {
  // motion.create() lets us animate any dynamic element type (div, h1, p, etc.)
  const MotionTag = useMemo(() => motion.create(as), [as])

  const variants: Variants = {
    hidden: { opacity: 0, x, y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { delay, duration, ease: EASE },
    },
  }

  return (
    <MotionTag
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '50px', amount: 0 }}
    >
      {children}
    </MotionTag>
  )
}
