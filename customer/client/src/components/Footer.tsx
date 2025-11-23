import { ShoppingBag } from "lucide-react"
import IntersectionObserver from "./IntersectionObserver"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <IntersectionObserver>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4 group">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Nukkad</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Connecting you to the best local deals and helping you save money on fashion, accessories, and more.
              </p>
              <div className="flex space-x-4">
                {["F", "T", "I"].map((social, index) => (
                  <a
                    key={social}
                    href="#"
                    className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-sm font-bold">{social}</span>
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: "Company", links: ["About Us", "Careers", "Press", "Blog"] },
              { title: "Support", links: ["Help Center", "Contact Us", "FAQ", "Community"] },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-3 text-base">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2024 Nukkad. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:underline"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:underline"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </IntersectionObserver>
      </div>
    </footer>
  )
}

export default Footer
