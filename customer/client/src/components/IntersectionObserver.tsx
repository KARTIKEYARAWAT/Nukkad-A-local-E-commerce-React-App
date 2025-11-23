"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"

interface IntersectionObserverProps {
  children: React.ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
  animationClass?: string
}

const IntersectionObserver = ({
  children,
  threshold = 0.1,
  rootMargin = "0px 0px -100px 0px",
  className = "",
  animationClass = "animate-slide-up",
}: IntersectionObserverProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold, rootMargin },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-1000 ${className} ${
        isVisible ? `opacity-100 ${animationClass}` : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  )
}

export default IntersectionObserver
