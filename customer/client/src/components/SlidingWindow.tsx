"use client"

import type React from "react"

import { useState } from "react"

interface SlidingWindowProps {
  children: React.ReactNode
  direction?: "left" | "right" | "up" | "down"
  className?: string
}

const SlidingWindow = ({ children, direction = "left", className = "" }: SlidingWindowProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const getTransform = () => {
    if (!isHovered) return "translate3d(0, 0, 0) scale(1)"

    switch (direction) {
      case "left":
        return "translate3d(-8px, 0, 0) scale(1.02)"
      case "right":
        return "translate3d(8px, 0, 0) scale(1.02)"
      case "up":
        return "translate3d(0, -8px, 0) scale(1.02)"
      case "down":
        return "translate3d(0, 8px, 0) scale(1.02)"
      default:
        return "translate3d(0, 0, 0) scale(1.02)"
    }
  }

  return (
    <div
      className={`transition-all duration-500 ease-out transform ${className}`}
      style={{
        transform: getTransform(),
        boxShadow: isHovered ? "0 25px 50px rgba(0, 0, 0, 0.15)" : "0 10px 25px rgba(0, 0, 0, 0.08)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  )
}

export default SlidingWindow
