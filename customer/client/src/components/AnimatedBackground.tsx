"use client"

import { useEffect, useState } from "react"

const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Enhanced Gradient Background with 3D movement */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px, 0) scale(1.1)`,
        }}
      />

      {/* 3D Animated Blobs with mouse interaction */}
      <div
        className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"
        style={{
          transform: `translate3d(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.03}px, 0) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`,
        }}
      />
      <div
        className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"
        style={{
          transform: `translate3d(${-mousePosition.x * 0.03}px, ${mousePosition.y * 0.04}px, 0) rotateX(${-mousePosition.y * 0.1}deg) rotateY(${-mousePosition.x * 0.1}deg)`,
        }}
      />
      <div
        className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"
        style={{
          transform: `translate3d(${mousePosition.x * 0.04}px, ${-mousePosition.y * 0.02}px, 0) rotateX(${mousePosition.y * 0.15}deg) rotateY(${mousePosition.x * 0.15}deg)`,
        }}
      />

      {/* 3D Floating Particles with depth */}
      <div
        className="absolute top-1/4 left-1/4 w-4 h-4 bg-orange-400/30 rounded-full animate-float"
        style={{
          transform: `translate3d(${mousePosition.x * 0.08}px, ${mousePosition.y * 0.06}px, 20px)`,
        }}
      />
      <div
        className="absolute top-1/3 right-1/3 w-3 h-3 bg-pink-400/40 rounded-full animate-float animation-delay-1000"
        style={{
          transform: `translate3d(${-mousePosition.x * 0.06}px, ${mousePosition.y * 0.08}px, 15px)`,
        }}
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-purple-400/30 rounded-full animate-float animation-delay-2000"
        style={{
          transform: `translate3d(${mousePosition.x * 0.07}px, ${-mousePosition.y * 0.05}px, 25px)`,
        }}
      />
      <div
        className="absolute top-1/2 right-1/4 w-2 h-2 bg-yellow-400/40 rounded-full animate-float animation-delay-3000"
        style={{
          transform: `translate3d(${-mousePosition.x * 0.09}px, ${mousePosition.y * 0.07}px, 10px)`,
        }}
      />

      {/* 3D Gradient Orb with rotation */}
      <div
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-orange-400/10 to-pink-400/10 rounded-full animate-pulse-slow"
        style={{
          transform: `translate(-50%, -50%) translate3d(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.03}px, 0) rotateX(${mousePosition.y * 0.2}deg) rotateY(${mousePosition.x * 0.2}deg) scale(${1 + (mousePosition.x + mousePosition.y) * 0.0005})`,
        }}
      />
    </div>
  )
}

export default AnimatedBackground
