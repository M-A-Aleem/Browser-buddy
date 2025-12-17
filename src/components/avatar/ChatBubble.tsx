import { useState, useRef, useEffect } from 'react'
import { Send, Mic, X, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ChatBubbleProps {
  position: { x: number; y: number }
  onClose: () => void
}

export default function ChatBubble({ position, onClose }: ChatBubbleProps) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'avatar'; text: string }>>([
    { role: 'avatar', text: 'Hi there! 👋 How can I help you today?' },
  ])
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Position chat bubble near avatar
  const chatPosition = {
    left: Math.min(position.x + 80, window.innerWidth - 320),
    top: Math.max(position.y - 100, 20),
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!message.trim()) return

    setMessages(prev => [...prev, { role: 'user', text: message }])
    
    // Simple response (will integrate AI in Phase 2)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'avatar',
        text: "I'm here to keep you company! 🎉 More features coming soon!"
      }])
    }, 500)

    setMessage('')
  }

  const handleMicClick = () => {
    setIsListening(!isListening)
    // Will implement Web Speech API in Phase 2
    if (!isListening) {
      setTimeout(() => setIsListening(false), 3000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className="fixed z-[10000] w-80 animate-slide-up"
      style={{
        left: `${chatPosition.left}px`,
        top: `${chatPosition.top}px`,
      }}
    >
      <div className="glass rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-medium text-sm">Your Companion</span>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-64 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button
              size="icon"
              variant={isListening ? 'destructive' : 'outline'}
              onClick={handleMicClick}
            >
              {isListening ? <Volume2 className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button size="icon" onClick={handleSend} disabled={!message.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send • Click mic for voice
          </p>
        </div>
      </div>
    </div>
  )
}
