import { useState } from 'react';
import { MessageCircle, Send, Bot, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatAIService } from '@/services/llm/chatAI.service';

export const AIChatAssistant = ({ stores }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your local shopping assistant powered by Google Gemini AI. Ask me about stores, products, or get personalized recommendations!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredAction, setHoveredAction] = useState(null);

  const chatService = new ChatAIService();

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await chatService.getChatResponse(currentInput, stores, messages);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.content,
        stores: response.recommendedStores,
        actions: response.suggestedActions,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting to the AI service right now. Please try again later.",
        timestamp: new Date()
      }]);
    }

    setLoading(false);
  };

  const quickQuestions = [
    "Find nearest pharmacy",
    "Best rated restaurants", 
    "Grocery stores open now",
    "Where can I buy electronics?",
    "Cafes for studying",
    "Stores with offers"
  ];

  return (
    <>
      {/* Chat Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg transition-all duration-300 hover:scale-110 text-white hover:text-white"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold">AI Shopping Assistant</h3>
                <p className="text-xs opacity-90">Powered by Google Gemini</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 hover:text-white w-8 h-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="flex items-start space-x-2">
                    {message.role === 'assistant' && (
                      <Bot className="h-4 w-4 mt-1 flex-shrink-0 text-purple-600" />
                    )}
                    {message.role === 'user' && (
                      <User className="h-4 w-4 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      
                      {/* Recommended Stores */}
                      {message.stores && message.stores.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-medium opacity-80">Recommended stores:</p>
                          {message.stores.map((store, idx) => (
                            <div key={idx} className="bg-white/20 rounded-lg p-2 text-xs">
                              <div className="font-medium flex items-center space-x-1">
                                <span>{store.image}</span>
                                <span>{store.name}</span>
                                <span className="text-yellow-400">★{store.rating}</span>
                              </div>
                              <div className="opacity-90 mt-1">{store.reason || store.matchReason}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Suggested Actions */}
                      {message.actions && message.actions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {message.actions.map((action, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              className="text-xs h-6 bg-white/50 hover:bg-white/80 border-white/30 text-gray-700 hover:text-gray-900"
                              onClick={() => setInput(action)}
                            >
                              {action.length > 15 ? `${action.substring(0, 15)}...` : action}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl p-3 max-w-[85%]">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-purple-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="border-t border-gray-100 p-3">
              <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
              <div className="grid grid-cols-2 gap-1">
                {quickQuestions.map((question, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    size="sm"
                    onClick={() => setInput(question)}
                    className="text-xs h-8 justify-start p-2 hover:bg-purple-50 text-purple-700 hover:text-purple-900 w-full text-left"
                  >
                    {question.length > 18 ? `${question.substring(0, 18)}...` : question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about stores, products, or recommendations..."
                disabled={loading}
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={loading || !input.trim()} 
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white hover:text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Google Gemini AI
            </p>
          </div>
        </div>
      )}
    </>
  );
};