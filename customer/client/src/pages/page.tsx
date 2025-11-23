"use client"
import Navbar from "../components/Navbar"
import InteractiveHero from "../components/InteractiveHero"
import ParallaxShowcase from "../components/ParallaxShowcase"
import HowItWorks from "../components/HowItWorks"
import EnhancedTestimonials from "../components/EnhancedTestimonials"
import Footer from "../components/Footer"
import AIAssistant from "../components/AIAssistant"
import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Sparkles, X } from "lucide-react"
import './globals.css'
// Floating Deal Notifications (Dynamic Element)
function FloatingNotifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Sarah saved ₹2,400 on Nike shoes!", visible: false },
    { id: 2, text: "New 60% off sale at Fashion Street!", visible: false },
    { id: 3, text: "Raj found designer bags at 70% off!", visible: false },
  ])

  useEffect(() => {
    const showNotification = (index: number) => {
      setTimeout(() => {
        setNotifications((prev) => prev.map((notif, i) => (i === index ? { ...notif, visible: true } : notif)))

        setTimeout(() => {
          setNotifications((prev) => prev.map((notif, i) => (i === index ? { ...notif, visible: false } : notif)))
        }, 3000)
      }, index * 4000)
    }

    notifications.forEach((_, index) => showNotification(index))

    const interval = setInterval(() => {
      notifications.forEach((_, index) => showNotification(index))
    }, 12000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-24 right-4 z-30 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`transform transition-all duration-500 ${
            notification.visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <div className="bg-white rounded-lg shadow-lg border border-orange-100 p-3 max-w-xs">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-gray-700">{notification.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span>{count}</span>
}

// Parallax Background Shapes (Subtle Dynamic)
function ParallaxShapes() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle moving shapes */}
      <div
        className="absolute w-64 h-64 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full opacity-30 blur-3xl"
        style={{
          top: "10%",
          left: "10%",
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          transition: "transform 0.1s ease-out",
        }}
      />
      <div
        className="absolute w-96 h-96 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full opacity-20 blur-3xl"
        style={{
          top: "60%",
          right: "10%",
          transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.02}px)`,
          transition: "transform 0.1s ease-out",
        }}
      />
    </div>
  )
}

// Interactive Deal Cards (Dynamic)
function InteractiveDealCard({
  emoji,
  title,
  discount,
  originalPrice,
  salePrice,
}: {
  emoji: string
  title: string
  discount: string
  originalPrice: string
  salePrice: string
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
      }}
    >
      <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">{emoji}</div>
      <div className="font-semibold text-gray-800 mb-2">{title}</div>
      <div className="text-orange-500 font-bold text-lg mb-2">{discount}</div>
      <div className="flex items-center space-x-2">
        <span className="text-gray-400 line-through text-sm">{originalPrice}</span>
        <span className="text-green-600 font-bold">{salePrice}</span>
      </div>

      {/* Hover effect overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-2xl transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Animated border */}
      <div
        className={`absolute inset-0 rounded-2xl border-2 border-gradient-to-r from-orange-500 to-pink-500 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "linear-gradient(white, white) padding-box, linear-gradient(45deg, #ff6a00, #ee0979) border-box",
          border: "2px solid transparent",
        }}
      />
    </div>
  )
}

// Signup Modal (Static Structure, Dynamic Animations)
function SignupModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full transform animate-in fade-in-0 zoom-in-95 duration-300 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Join Nukkad</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form className="space-y-4">
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400"
              placeholder="Enter your name"
            />
          </div>
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400"
              placeholder="Enter your email"
            />
          </div>
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400"
              placeholder="Enter your phone"
            />
          </div>
          <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-3 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
            Get Started
            <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </div>
    </div>
  )
}

const Index = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <InteractiveHero />
      <ParallaxShowcase />
      <HowItWorks />
      <EnhancedTestimonials />
      <Footer />
      <AIAssistant />
    </div>
  )
}

export default Index
