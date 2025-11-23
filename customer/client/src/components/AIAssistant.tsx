"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "./ui/button"
import { MessageCircle, X, Send, Sparkles } from "lucide-react"

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm Nukkad AI 🛍️ I can help you find the best deals near you. What are you looking for today?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const aiResponses = [
    "Great choice! I found 15 fashion deals within 2km of your location. The best one is 60% off at Fashion Hub! 🎉",
    "Perfect! There are 8 shoe stores having sales this week. Nike has 40% off running shoes just 500m away! 👟",
    "Awesome! I've located 12 accessory deals nearby. Check out the jewelry sale at Silver Dreams - 70% off! ✨",
    "Excellent! Found 20 local deals matching your preferences. The closest one is a bag sale at Style Central! 👜",
    "Amazing! There's a mega sale happening at Fashion Street with up to 80% off. Want directions? 🗺️",
  ]

  const quickReplies = [
    { text: "Find fashion deals", icon: "👗" },
    { text: "Show nearby stores", icon: "📍" },
    { text: "Best discounts", icon: "💰" },
    { text: "New arrivals", icon: "✨" },
  ]

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <>
      {/* Floating AI Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 ${
            isOpen ? "scale-110 rotate-180" : "animate-bounce"
          }`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-orange-500 animate-ping opacity-20"></div>
        </Button>
      </div>

      {/* AI Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-40 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-4 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white animate-spin" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Nukkad AI Assistant</h3>
                <p className="text-white/80 text-sm">Online • Ready to help</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 h-80 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs p-3 rounded-2xl ${
                    message.isUser
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  } animate-in slide-in-from-bottom-2 duration-200`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl animate-pulse">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(reply.text)}
                  className="bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-gray-700 px-3 py-1 rounded-full text-xs transition-all duration-200 hover:scale-105"
                >
                  {reply.icon} {reply.text}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                placeholder="Ask me about deals..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Button
                onClick={() => handleSendMessage(inputValue)}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AIAssistant
