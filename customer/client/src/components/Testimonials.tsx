"use client"

import { Star, Quote } from "lucide-react"
import { useEffect, useState } from "react"
import ParallaxSection from "./ParallaxSection"
import IntersectionObserver from "./IntersectionObserver"

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      content: "Nukkad helped me discover amazing local boutiques I never knew existed. Saved over $200 last month!",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Mike Chen",
      role: "Local Shopper",
      content: "The real-time updates are incredible. Never miss a good deal again thanks to Nukkad's notifications.",
      rating: 5,
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "Bargain Hunter",
      content:
        "Love supporting local businesses while getting great deals. This app is a game-changer for my shopping routine.",
      rating: 5,
      avatar: "ER",
    },
    {
      name: "David Kim",
      role: "Tech Enthusiast",
      content: "The user interface is so intuitive and the location-based features work perfectly. Highly recommended!",
      rating: 5,
      avatar: "DK",
    },
    {
      name: "Lisa Parker",
      role: "Smart Shopper",
      content: "I've saved hundreds of dollars using Nukkad. The notifications are timely and the deals are genuine.",
      rating: 5,
      avatar: "LP",
    },
  ]

  // Auto-slide effect only when visible
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [testimonials.length, isVisible])

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <IntersectionObserver>
          <ParallaxSection speed={-0.1}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 hover:bg-clip-text hover:text-transparent transition-all duration-500">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto hover:text-gray-800 transition-colors duration-300">
                Real stories from real savers in your community
              </p>
            </div>
          </ParallaxSection>
        </IntersectionObserver>

        {/* Smooth sliding testimonials container */}
        <IntersectionObserver threshold={0.3} rootMargin="0px 0px -50px 0px">
          <div className="relative" onAnimationStart={() => setIsVisible(true)}>
            {/* Main testimonials slider */}
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-1000 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / 3)}%)`,
                }}
              >
                {/* Duplicate testimonials for seamless loop */}
                {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
                  <div key={index} className="flex-shrink-0 w-full md:w-1/3 px-4">
                    <div className="group bg-gray-50 rounded-2xl p-8 relative hover:shadow-2xl hover:bg-white transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 cursor-pointer overflow-hidden h-full">
                      {/* Hover gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                      <Quote className="w-8 h-8 text-orange-500/30 mb-4 group-hover:text-orange-500 group-hover:scale-110 transition-all duration-300 relative z-10" />

                      <div className="flex mb-4 relative z-10">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 text-yellow-400 fill-current group-hover:scale-110 transition-all duration-300"
                            style={{ transitionDelay: `${i * 50}ms` }}
                          />
                        ))}
                      </div>

                      <p className="text-gray-700 mb-6 leading-relaxed group-hover:text-gray-900 transition-colors duration-300 relative z-10">
                        "{testimonial.content}"
                      </p>

                      <div className="flex items-center relative z-10">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold mr-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors duration-300">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced pagination dots */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                    currentIndex === index
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            {/* Navigation arrows */}
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
            >
              <svg
                className="w-6 h-6 text-gray-600 group-hover:text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
            >
              <svg
                className="w-6 h-6 text-gray-600 group-hover:text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </IntersectionObserver>
      </div>
    </section>
  )
}

export default Testimonials
