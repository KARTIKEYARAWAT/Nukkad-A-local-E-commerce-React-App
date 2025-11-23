"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, MapPin, Zap, TrendingUp, Users, Star, Heart, Award } from "lucide-react"
import IntersectionObserver from "./IntersectionObserver"

const ParallaxShowcase = () => {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const features = [
    {
      icon: ShoppingBag,
      title: "Smart Shopping",
      description: "AI-powered recommendations based on your preferences and location",
      color: "from-orange-500 to-pink-500",
      hoverColor: "from-orange-600 to-pink-600",
      bgColor: "from-orange-50 to-pink-50",
      delay: 0,
      isPremium: true,
    },
    {
      icon: MapPin,
      title: "Location-Based",
      description: "Find deals within walking distance using advanced geolocation",
      color: "from-pink-500 to-purple-500",
      hoverColor: "from-pink-600 to-purple-600",
      bgColor: "from-pink-50 to-purple-50",
      delay: 200,
      isPremium: false,
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Get instant notifications when new deals match your interests",
      color: "from-purple-500 to-blue-500",
      hoverColor: "from-purple-600 to-blue-600",
      bgColor: "from-purple-50 to-blue-50",
      delay: 400,
      isPremium: false,
    },
  ]

  const stats = [
    { icon: Users, number: "50K+", label: "Active Users", color: "text-orange-500" },
    { icon: ShoppingBag, number: "10K+", label: "Daily Deals", color: "text-pink-500" },
    { icon: MapPin, number: "500+", label: "Cities", color: "text-purple-500" },
    { icon: TrendingUp, number: "70%", label: "Avg. Savings", color: "text-blue-500" },
  ]

  return (
    <section className="py-32 bg-white overflow-hidden relative">
      {/* Parallax Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-100/30 to-pink-100/30 rounded-full"
          style={{
            transform: `translate3d(${mousePosition.x * 0.02}px, ${scrollY * 0.1}px, 0) scale(1.2)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-100/30 to-blue-100/30 rounded-full"
          style={{
            transform: `translate3d(${-mousePosition.x * 0.03}px, ${-scrollY * 0.05}px, 0)`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Features Section */}
        <IntersectionObserver>
          <div className="text-center mb-20">
            <div className="inline-block p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl mb-8">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-gradient bg-200%">
                Why Choose Nukkad?
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-medium">
              Experience the future of local shopping with our innovative features
            </p>
          </div>
        </IntersectionObserver>

        <div className="grid md:grid-cols-3 gap-12 mb-24">
          {features.map((feature, index) => (
            <IntersectionObserver key={index} className="h-full">
              <div
                className="group h-full"
                style={{
                  transform: `translateY(${scrollY * (0.02 + index * 0.01)}px)`,
                }}
              >
                <div
                  className={`bg-gradient-to-br ${feature.bgColor} rounded-3xl p-8 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-700 hover:scale-105 hover:-translate-y-8 h-full flex flex-col relative overflow-hidden group-hover:bg-white`}
                >
                  {/* Animated Background Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700 rounded-3xl`}
                  ></div>

                  {/* Floating Icons */}
                  <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <Star className="w-8 h-8 text-yellow-400 animate-pulse" />
                  </div>
                  <div className="absolute bottom-4 left-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <Heart className="w-6 h-6 text-red-400 animate-bounce" />
                  </div>

                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${feature.color} group-hover:bg-gradient-to-r group-hover:${feature.hoverColor} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-2xl relative z-10`}
                  >
                    <feature.icon className="w-10 h-10 text-white group-hover:animate-pulse" />
                    <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-500 relative z-10">
                    {feature.title}
                  </h3>

                  <p className="text-gray-700 leading-relaxed flex-grow text-lg group-hover:text-gray-800 transition-colors duration-500 relative z-10">
                    {feature.description}
                  </p>

                  {/* Hover Effect Elements - Only for Premium Features */}
                  {feature.isPremium && (
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 relative z-10">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span>Premium Feature</span>
                      </div>
                    </div>
                  )}

                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 transition-all duration-500"></div>
                </div>
              </div>
            </IntersectionObserver>
          ))}
        </div>

        {/* Larger Join the Revolution Section */}
        <IntersectionObserver>
          <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 rounded-3xl p-16 relative overflow-hidden shadow-2xl">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full filter blur-3xl animate-blob"
                style={{
                  transform: `translate3d(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.02}px, 0)`,
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"
                style={{
                  transform: `translate3d(${-mousePosition.x * 0.02}px, ${-mousePosition.y * 0.03}px, 0)`,
                }}
              />
            </div>

            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-bold text-white text-center mb-12 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Join the Revolution
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center group cursor-pointer"
                    style={{
                      transform: `translateY(${scrollY * (0.01 + index * 0.005)}px)`,
                    }}
                  >
                    <div className="w-20 h-20 mx-auto mb-6 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 border border-white/20 group-hover:bg-white/20 shadow-lg">
                      <stat.icon className={`w-10 h-10 ${stat.color} group-hover:animate-bounce`} />
                    </div>
                    <div className="text-4xl font-bold text-white mb-4 group-hover:scale-125 transition-transform duration-500 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-pink-400 group-hover:bg-clip-text">
                      {stat.number}
                    </div>
                    <div className="text-gray-300 text-lg group-hover:text-white transition-colors duration-500 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </IntersectionObserver>
      </div>
    </section>
  )
}

export default ParallaxShowcase
