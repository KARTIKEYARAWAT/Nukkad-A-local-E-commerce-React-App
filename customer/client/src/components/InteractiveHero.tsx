"use client"

import { ArrowRight, MapPin, ShoppingBag, Zap, Sparkles } from "lucide-react"
import { Button } from "./ui/button"
import { useState, useEffect } from "react"

const InteractiveHero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroSlides = [
    {
      title: "Discover Hot Deals",
      subtitle: "Near You",
      description: "Find the best local sales on fashion, accessories and more — right from your street.",
      cta: "Start Shopping",
      gradient: "from-orange-500 to-pink-500",
    },
    {
      title: "Save Big on",
      subtitle: "Fashion",
      description: "Get up to 70% off on your favorite brands with exclusive local deals and offers.",
      cta: "Find Deals",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Connect with",
      subtitle: "Local Stores",
      description: "Support your community while getting amazing discounts on quality products.",
      cta: "Explore Now",
      gradient: "from-pink-500 to-orange-500",
    },
  ]

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleGetStarted = () => {
    window.location.href = "/signup"
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-white">
      {/* Enhanced Animated Background with Attractive Circles */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Dynamic Gradient Background */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 transition-all duration-1000"
          style={{
            transform: `translate3d(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px, 0) scale(1.1)`,
          }}
        />

        {/* Large Attractive Background Circles */}
        <div
          className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-orange-400/15 to-pink-400/15 rounded-full mix-blend-multiply filter blur-2xl animate-blob"
          style={{
            transform: `translate3d(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.03}px, 0)`,
          }}
        />
        <div
          className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"
          style={{
            transform: `translate3d(${-mousePosition.x * 0.03}px, ${mousePosition.y * 0.04}px, 0)`,
          }}
        />
        <div
          className="absolute bottom-20 left-40 w-72 h-72 bg-gradient-to-r from-purple-400/15 to-orange-400/15 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000"
          style={{
            transform: `translate3d(${mousePosition.x * 0.04}px, ${-mousePosition.y * 0.02}px, 0)`,
          }}
        />

        {/* Medium Decorative Circles */}
        <div
          className="absolute top-1/3 left-1/4 w-48 h-48 bg-gradient-to-r from-yellow-300/10 to-orange-300/10 rounded-full animate-pulse"
          style={{
            transform: `translate3d(${mousePosition.x * 0.06}px, ${mousePosition.y * 0.04}px, 0)`,
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full animate-pulse animation-delay-3000"
          style={{
            transform: `translate3d(${-mousePosition.x * 0.05}px, ${-mousePosition.y * 0.03}px, 0)`,
          }}
        />

        {/* Small Accent Circles */}
        <div
          className="absolute top-1/4 right-1/3 w-24 h-24 bg-gradient-to-r from-pink-300/20 to-red-300/20 rounded-full animate-bounce"
          style={{
            transform: `translate3d(${mousePosition.x * 0.08}px, ${mousePosition.y * 0.06}px, 0)`,
            animationDuration: "3s",
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-gradient-to-r from-green-300/15 to-teal-300/15 rounded-full animate-bounce animation-delay-1000"
          style={{
            transform: `translate3d(${-mousePosition.x * 0.07}px, ${-mousePosition.y * 0.05}px, 0)`,
            animationDuration: "4s",
          }}
        />

        {/* Floating Ring Circles */}
        <div
          className="absolute top-1/2 left-1/6 w-40 h-40 border-4 border-orange-300/20 rounded-full animate-spin"
          style={{
            transform: `translate3d(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.02}px, 0)`,
            animationDuration: "20s",
          }}
        />
        <div
          className="absolute top-1/6 right-1/6 w-28 h-28 border-3 border-purple-300/25 rounded-full animate-spin"
          style={{
            transform: `translate3d(${-mousePosition.x * 0.04}px, ${mousePosition.y * 0.03}px, 0)`,
            animationDuration: "15s",
            animationDirection: "reverse",
          }}
        />

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full animate-float opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Glowing Orbs */}
        <div
          className="absolute top-1/5 left-1/5 w-16 h-16 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full animate-pulse shadow-lg"
          style={{
            transform: `translate3d(${mousePosition.x * 0.09}px, ${mousePosition.y * 0.07}px, 0)`,
            boxShadow: "0 0 30px rgba(255, 165, 0, 0.3)",
          }}
        />
        <div
          className="absolute bottom-1/5 right-1/5 w-20 h-20 bg-gradient-to-r from-purple-400/25 to-pink-400/25 rounded-full animate-pulse shadow-lg animation-delay-2000"
          style={{
            transform: `translate3d(${-mousePosition.x * 0.08}px, ${-mousePosition.y * 0.06}px, 0)`,
            boxShadow: "0 0 25px rgba(147, 51, 234, 0.3)",
          }}
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Content Side - Left */}
          <div className="text-center lg:text-left relative z-30 flex flex-col justify-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/90 backdrop-blur-xl border border-orange-200 mb-10 hover:bg-white/95 transition-all duration-300 animate-bounce-gentle shadow-xl mx-auto lg:mx-0">
              <Zap className="w-5 h-5 text-orange-500 mr-3" />
              <span className="text-base font-semibold text-gray-800">Now Live in Your Area!</span>
            </div>

            {/* Dynamic Headlines */}
            <div className="relative h-40 mb-12 overflow-visible">
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ${
                    index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
                  }`}
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-normal">
                    {slide.title}{" "}
                    <span
                      className={`bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent block lg:inline`}
                    >
                      {slide.subtitle}
                    </span>
                  </h1>
                </div>
              ))}
            </div>

            {/* Dynamic Description */}
            <div className="relative h-28 mb-14 overflow-visible">
              {heroSlides.map((slide, index) => (
                <p
                  key={index}
                  className={`absolute inset-0 text-xl md:text-2xl lg:text-3xl text-gray-700 leading-relaxed transition-all duration-1000 max-w-2xl ${
                    index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
                  }`}
                >
                  {slide.description}
                </p>
              ))}
            </div>

            {/* Feature Icons */}
            <div className="flex justify-center lg:justify-start space-x-10 mb-14">
              {[
                { icon: MapPin, label: "Local Deals", color: "text-orange-500" },
                { icon: ShoppingBag, label: "Fashion & More", color: "text-pink-500" },
                { icon: Zap, label: "Real-time Updates", color: "text-purple-500" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 text-gray-800 hover:scale-110 transition-all duration-300 cursor-pointer group"
                >
                  <feature.icon className={`w-7 h-7 ${feature.color} group-hover:animate-bounce`} />
                  <span className="font-semibold text-lg group-hover:text-gray-900">{feature.label}</span>
                </div>
              ))}
            </div>

            {/* Dynamic CTA Button */}
            <div className="relative h-20 mb-10">
              {heroSlides.map((slide, index) => (
                <Button
                  key={index}
                  onClick={handleGetStarted}
                  className={`absolute left-1/2 lg:left-0 transform -translate-x-1/2 lg:translate-x-0 transition-all duration-1000 bg-gradient-to-r ${slide.gradient} hover:scale-110 text-white font-bold py-5 px-10 rounded-full text-xl shadow-2xl group z-40 ${
                    index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
                  }`}
                >
                  <Sparkles className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  {slide.cta}
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              ))}
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center lg:justify-start mt-8 space-x-4">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full z-40 relative ${
                    currentSlide === index
                      ? "w-16 h-4 bg-gradient-to-r from-orange-500 to-pink-500"
                      : "w-4 h-4 bg-gray-400 hover:bg-gray-500 hover:scale-125"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Visual Side - Right */}
          <div className="relative z-30 flex items-center justify-center">
            {/* Main Visual Container */}
            <div className="relative w-full max-w-lg">
              {/* Glassmorphism Container */}
              <div className="bg-white/40 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border border-white/50 relative overflow-hidden">
                {/* Central Illustration */}
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl relative">
                    <ShoppingBag className="w-24 h-24 text-white" />
                    {/* Pulsing Ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-pulse"></div>
                  </div>

                  {/* Fixed Text Section with Better Spacing */}
                  <div className="space-y-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">Your Local Shopping</h3>
                    <h4 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                      Revolution
                    </h4>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-md mx-auto">
                      Discover amazing deals from local stores in your neighborhood and save money while supporting your
                      community.
                    </p>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white font-bold">%</span>
                </div>
                <div className="absolute bottom-4 left-4 w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-sm">💰</span>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-6 -left-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl z-40 animate-bounce">
                <div className="flex items-center">
                  <span className="mr-2">🎯</span>
                  50K+ Users
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl z-40 animate-pulse">
                <div className="flex items-center">
                  <span className="mr-2">⭐</span>
                  4.9 Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InteractiveHero
