"use client"

import { ArrowRight, MapPin, ShoppingBag, Zap } from "lucide-react"
import { Button } from "./ui/button"
import AnimatedBackground from "./AnimatedBackground"
import ParallaxSection from "./ParallaxSection"
import SlidingWindow from "./SlidingWindow"
import IntersectionObserver from "./IntersectionObserver"

const HeroSection = () => {
  const handleGetStarted = () => {
    window.location.href = "/signup"
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge with parallax */}
          <IntersectionObserver animationClass="animate-bounce-gentle">
            <ParallaxSection speed={-0.2}>
              <SlidingWindow direction="down">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-400/10 to-pink-400/10 border border-orange-400/20 mb-8 hover:from-orange-400/20 hover:to-pink-400/20 transition-all duration-300">
                  <Zap className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="text-sm font-medium text-gray-800">Now Live in Your Area!</span>
                </div>
              </SlidingWindow>
            </ParallaxSection>
          </IntersectionObserver>

          {/* Main Headline with parallax */}
          <IntersectionObserver>
            <ParallaxSection speed={-0.1}>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight transform hover:scale-105 transition-transform duration-500">
                Discover{" "}
                <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent hover:from-pink-500 hover:to-orange-500 transition-all duration-300">
                  Hot Deals
                </span>{" "}
                Near You
              </h1>
            </ParallaxSection>
          </IntersectionObserver>

          {/* Subtext with parallax */}
          <IntersectionObserver>
            <ParallaxSection speed={0.1}>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed hover:text-gray-800 transition-colors duration-300">
                Find the best local sales on fashion, accessories and more — right from your street.
              </p>
            </ParallaxSection>
          </IntersectionObserver>

          {/* Feature Icons with sliding effects */}
          <IntersectionObserver>
            <ParallaxSection speed={-0.05}>
              <div className="flex justify-center space-x-8 mb-12">
                <SlidingWindow direction="left">
                  <div className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors duration-300 cursor-pointer">
                    <MapPin className="w-6 h-6 text-orange-500" />
                    <span className="font-medium">Local Deals</span>
                  </div>
                </SlidingWindow>
                <SlidingWindow direction="up">
                  <div className="flex items-center space-x-2 text-gray-700 hover:text-pink-500 transition-colors duration-300 cursor-pointer">
                    <ShoppingBag className="w-6 h-6 text-pink-500" />
                    <span className="font-medium">Fashion & More</span>
                  </div>
                </SlidingWindow>
                <SlidingWindow direction="right">
                  <div className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors duration-300 cursor-pointer">
                    <Zap className="w-6 h-6 text-orange-500" />
                    <span className="font-medium">Real-time Updates</span>
                  </div>
                </SlidingWindow>
              </div>
            </ParallaxSection>
          </IntersectionObserver>

          {/* CTA Button with enhanced effects */}
          <IntersectionObserver>
            <ParallaxSection speed={0.05}>
              <SlidingWindow direction="up">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-500 transform hover:scale-110 hover:rotate-1 shadow-lg hover:shadow-2xl group relative overflow-hidden"
                >
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Button>
              </SlidingWindow>
            </ParallaxSection>
          </IntersectionObserver>

          {/* Trust Indicators with parallax */}
          <IntersectionObserver>
            <ParallaxSection speed={0.1}>
              <div className="mt-12 text-sm text-gray-500">
                <p className="hover:text-gray-700 transition-colors duration-300">
                  Join 10,000+ savvy shoppers already saving with Nukkad
                </p>
              </div>
            </ParallaxSection>
          </IntersectionObserver>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
