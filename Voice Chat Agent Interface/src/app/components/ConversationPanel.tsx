import { motion } from "motion/react";
import { Send, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ConversationPanelProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isConnected: boolean;
}

export function ConversationPanel({ messages, onSendMessage, isConnected }: ConversationPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && isConnected) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="h-full bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-lg flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Conversation</h2>
            <p className="text-xs text-gray-400">
              {messages.length === 0
                ? "No messages yet"
                : `${messages.length} message${messages.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div ref={scrollRef} className="space-y-4">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center py-12"
            >
              <div className="p-4 rounded-full bg-gray-100 mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm mb-2">No messages yet</p>
              <p className="text-gray-400 text-xs">
                {isConnected ? "Start speaking or type a message" : "Connect to start chatting"}
              </p>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-800 shadow-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isConnected ? "Type a message..." : "Connect to start"}
              disabled={!isConnected}
              className="w-full h-12 bg-gray-50 border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
            />
          </div>
          <Button
            type="submit"
            disabled={!isConnected || !inputValue.trim()}
            className="h-12 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </motion.div>
  );
}