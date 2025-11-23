import { Search, MapPin, ShoppingCart, Star } from "lucide-react"
import ParallaxSection from "./ParallaxSection"
import SlidingWindow from "./SlidingWindow"
import IntersectionObserver from "./IntersectionObserver"

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Discover",
      description: "Browse local deals and sales happening near you in real-time",
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Navigate",
      description: "Get directions to the best deals using our integrated map feature",
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "Shop",
      description: "Visit stores and enjoy exclusive discounts on fashion & accessories",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Save",
      description: "Track your savings and discover new favorite local businesses",
    },
  ]

  return (
    <section className="pt-64 pb-32 bg-gradient-to-br from-gray-50 to-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-orange-200/30 to-pink-200/30 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-200/30 to-blue-200/30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <IntersectionObserver>
          <ParallaxSection speed={-0.1}>
            <div className="text-center mb-20">
              {/* Enhanced Heading with Better Visibility and Centering */}
              <div className="inline-block p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl mb-8 mx-auto">
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 transition-colors duration-500">
                  How It{" "}
                  <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    Works
                  </span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full"></div>
              </div>
              <p className="text-2xl text-gray-800 max-w-3xl mx-auto font-medium">
                Start saving money in four simple steps
              </p>
            </div>
          </ParallaxSection>
        </IntersectionObserver>

        {/* Centered Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl">
            {steps.map((step, index) => (
              <IntersectionObserver key={index} className="h-full">
                <ParallaxSection speed={index % 2 === 0 ? -0.05 : 0.05}>
                  <SlidingWindow direction={index % 2 === 0 ? "up" : "down"}>
                    <div className="text-center group relative h-full">
                      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-8 hover:rotate-2 relative overflow-hidden h-full flex flex-col border border-white/30">
                        <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 relative z-10 shadow-lg">
                          {step.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 transition-colors duration-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-pink-600 group-hover:bg-clip-text">
                          {step.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed transition-colors duration-300 flex-grow text-lg group-hover:text-gray-800">
                          {step.description}
                        </p>

                        {/* Enhanced Hover overlay effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                        {/* Animated Border */}
                        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 transition-all duration-500"></div>
                      </div>

                      {/* Enhanced Connecting Arrow */}
                      {index < steps.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-20">
                          <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-pink-500 group-hover:w-16 transition-all duration-500 rounded-full shadow-lg" />
                        </div>
                      )}
                    </div>
                  </SlidingWindow>
                </ParallaxSection>
              </IntersectionObserver>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
