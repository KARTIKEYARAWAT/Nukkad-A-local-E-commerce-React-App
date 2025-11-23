"use client"

import { Star, Quote, ArrowLeft, ArrowRight, Play, Pause } from "lucide-react"
import { useEffect, useState } from "react"
import IntersectionObserver from "./IntersectionObserver"

const EnhancedTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [direction, setDirection] = useState<"next" | "prev">("next")

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      content: "Nukkad helped me discover amazing local boutiques I never knew existed. Saved over $200 last month!",
      rating: 5,
      avatar: "SJ",
      location: "Mumbai",
      savings: "$200+",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      name: "Mike Chen",
      role: "Local Shopper",
      content: "The real-time updates are incredible. Never miss a good deal again thanks to Nukkad's notifications.",
      rating: 5,
      avatar: "MC",
      location: "Delhi",
      savings: "$150+",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      name: "Emily Rodriguez",
      role: "Bargain Hunter",
      content:
        "Love supporting local businesses while getting great deals. This app is a game-changer for my shopping routine.",
      rating: 5,
      avatar: "ER",
      location: "Bangalore",
      savings: "$300+",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      name: "David Kim",
      role: "Tech Enthusiast",
      content: "The user interface is so intuitive and the location-based features work perfectly. Highly recommended!",
      rating: 5,
      avatar: "DK",
      location: "Hyderabad",
      savings: "$180+",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      name: "Lisa Parker",
      role: "Smart Shopper",
      content: "I've saved hundreds of dollars using Nukkad. The notifications are timely and the deals are genuine.",
      rating: 5,
      avatar: "LP",
      location: "Chennai",
      savings: "$250+",
      image: "/placeholder.svg?height=400&width=400",
    },
  ]

  // Auto-slide effect
  useEffect(() => {
    if (!isVisible || !isPlaying) return

    const interval = setInterval(() => {
      setDirection("next")
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [testimonials.length, isVisible, isPlaying])

  const goToNext = () => {
    setDirection("next")
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const goToPrev = () => {
    setDirection("prev")
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-blob opacity-70"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-gradient-to-r from-pink-200 to-orange-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000 opacity-70"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-gradient-to-r from-orange-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000 opacity-70"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <IntersectionObserver threshold={0.2} rootMargin="0px 0px -50px 0px">
          <div className="text-center mb-16" onAnimationStart={() => setIsVisible(true)}>
            {/* Enhanced Heading with Glassmorphism */}
            <div className="inline-block p-8 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl mb-8">
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4 animate-gradient">
                What Our Users Say
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-orange-500 mx-auto rounded-full"></div>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Real stories from real savers in your community</p>
          </div>
        </IntersectionObserver>

        {/* Enhanced Testimonials Slider */}
        <div className="relative">
          {/* Main Testimonial Display */}
          <div className="relative h-96 mb-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentIndex
                    ? "opacity-100 scale-100 z-10"
                    : index === (currentIndex - 1 + testimonials.length) % testimonials.length
                      ? "opacity-30 scale-95 -translate-x-full z-0"
                      : index === (currentIndex + 1) % testimonials.length
                        ? "opacity-30 scale-95 translate-x-full z-0"
                        : "opacity-0 scale-90 z-0"
                }`}
                style={{
                  transform: `translateX(${
                    index === currentIndex
                      ? "0%"
                      : index === (currentIndex - 1 + testimonials.length) % testimonials.length
                        ? "-100%"
                        : index === (currentIndex + 1) % testimonials.length
                          ? "100%"
                          : "0%"
                  }) scale(${index === currentIndex ? "1" : "0.9"})`,
                }}
              >
                <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 h-full flex items-center">
                  <div className="grid md:grid-cols-2 gap-8 items-center w-full">
                    {/* Content */}
                    <div className="space-y-6">
                      <Quote className="w-12 h-12 text-purple-500 opacity-50" />

                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-6 h-6 text-yellow-400 fill-current animate-pulse"
                            style={{ animationDelay: `${i * 100}ms` }}
                          />
                        ))}
                      </div>

                      <p className="text-lg text-gray-700 leading-relaxed font-medium">"{testimonial.content}"</p>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-xl text-gray-900">{testimonial.name}</h4>
                          <p className="text-purple-600 font-medium">{testimonial.role}</p>
                          <p className="text-sm text-gray-500">{testimonial.location}</p>
                        </div>
                        <div className="text-right">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-bold">
                            Saved {testimonial.savings}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Avatar */}
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl animate-pulse">
                          {testimonial.avatar}
                        </div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-orange-500 animate-ping opacity-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-6">
            {/* Previous Button */}
            <button
              onClick={goToPrev}
              className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110 border border-white/30"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-110 shadow-lg"
            >
              {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-1" />}
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110 border border-white/30"
            >
              <ArrowRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Enhanced Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setDirection(index > currentIndex ? "next" : "prev")
                }}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index
                    ? "w-12 h-3 bg-gradient-to-r from-purple-500 to-orange-500"
                    : "w-3 h-3 bg-gray-300 hover:bg-gray-400 hover:scale-125"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Floating Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {[
            { label: "Happy Users", value: "10K+", icon: "😊" },
            { label: "Money Saved", value: "$2M+", icon: "💰" },
            { label: "Local Stores", value: "500+", icon: "🏪" },
            { label: "Daily Deals", value: "1K+", icon: "🔥" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EnhancedTestimonials
