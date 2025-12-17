import { useMemo, useState, useEffect } from 'react'
import type { AvatarSkin, AvatarState } from '@/types/avatar'
import { AVATAR_SKINS, getMoodEmoji, getRandomEmoji } from '@/types/avatar'

interface AvatarRendererV2Props {
  skin: AvatarSkin
  customImage?: string
  mood: AvatarState['mood']
  isMoving: boolean
  isSleeping: boolean
  isListening: boolean
  isSpeaking: boolean
  direction: 'left' | 'right'
  volume: number
  idleTime?: number
}

export default function AvatarRendererV2({
  skin,
  customImage,
  mood,
  isMoving,
  isSleeping,
  isListening,
  isSpeaking,
  direction,
  volume,
  idleTime = 0,
}: AvatarRendererV2Props) {
  const [currentEmoji, setCurrentEmoji] = useState('')
  const [showReaction, setShowReaction] = useState(false)

  // Update emoji based on mood changes
  useEffect(() => {
    const emoji = getMoodEmoji(mood, isMoving, isSleeping)
    setCurrentEmoji(emoji)
    
    // Show reaction bubble occasionally
    if (mood === 'curious' || mood === 'excited' || mood === 'thinking') {
      setShowReaction(true)
      setTimeout(() => setShowReaction(false), 3000)
    }
  }, [mood, isMoving, isSleeping])

  // Random reactions when idle for too long
  useEffect(() => {
    if (idleTime > 60000 && !isMoving && !isSleeping) { // 1 minute
      const reactionInterval = setInterval(() => {
        const reactions = ['🥱', '😴', '😑', '🙄']
        setCurrentEmoji(reactions[Math.floor(Math.random() * reactions.length)])
        setShowReaction(true)
        setTimeout(() => {
          setCurrentEmoji(getMoodEmoji(mood, isMoving, isSleeping))
          setShowReaction(false)
        }, 2000)
      }, 10000) // Every 10 seconds
      
      return () => clearInterval(reactionInterval)
    }
  }, [idleTime, isMoving, isSleeping, mood])

  const avatarEmoji = useMemo(() => {
    // Use custom image if provided
    if (skin === 'custom' && customImage) {
      return null
    }

    // Use dynamic emoji from state
    return currentEmoji || AVATAR_SKINS[skin].emoji
  }, [skin, customImage, currentEmoji])

  const animation = useMemo(() => {
    if (isSleeping) return 'animate-pulse-soft'
    if (isListening) return 'animate-wiggle'
    if (isSpeaking) return 'animate-bounce-gentle'
    if (isMoving) return 'animate-bounce-gentle'
    return 'animate-float'
  }, [isMoving, isSleeping, isListening, isSpeaking])

  return (
    <div
      className={`relative select-none ${animation}`}
      style={{
        transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
      }}
    >
      {/* Avatar */}
      <div className="relative">
        {customImage && skin === 'custom' ? (
          <img
            src={customImage}
            alt="Custom avatar"
            className="w-16 h-16 object-contain avatar-shadow transition-all duration-300 hover:scale-110"
          />
        ) : (
          <div className="text-6xl avatar-shadow transition-all duration-300 hover:scale-110">
            {avatarEmoji}
          </div>
        )}
        
        {/* Status indicator */}
        <div 
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background transition-colors ${
            isSleeping ? 'bg-gray-400' :
            isListening ? 'bg-red-500 animate-pulse' :
            isSpeaking ? 'bg-blue-500 animate-pulse' :
            'bg-green-500'
          }`} 
        />
      </div>

      {/* Speaking volume indicator */}
      {isSpeaking && volume > 0 && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
          <div className="flex items-end gap-0.5 h-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-primary rounded-full transition-all duration-100"
                style={{
                  height: `${Math.max(20, (volume * 100) - (i * 15))}%`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Thought bubble for curious mood */}
      {mood === 'curious' && !isMoving && !isListening && !isSpeaking && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none animate-slide-up">
          <div className="px-3 py-1 rounded-full bg-card border border-border text-xs shadow-lg">
            💭
          </div>
        </div>
      )}

      {/* Listening indicator */}
      {isListening && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
          <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/50 text-xs shadow-lg animate-pulse">
            <span className="text-red-600 dark:text-red-400">Listening...</span>
          </div>
        </div>
      )}

      {/* Random reaction bubble */}
      {showReaction && !isListening && !isSpeaking && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none animate-bounce-gentle">
          <div className="text-2xl">
            {mood === 'thinking' && '💭'}
            {mood === 'curious' && getRandomEmoji('curious')}
            {mood === 'excited' && getRandomEmoji('star')}
            {mood === 'lazy' && '💤'}
          </div>
        </div>
      )}

      {/* Idle/lazy indicator */}
      {idleTime > 120000 && !isMoving && !isSleeping && ( // 2 minutes
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-lg opacity-60 animate-pulse">
          💤
        </div>
      )}
    </div>
  )
}
