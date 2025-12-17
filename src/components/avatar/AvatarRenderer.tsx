import { useMemo } from 'react'

interface AvatarRendererProps {
  mood: 'idle' | 'curious' | 'alert' | 'bored' | 'sleepy'
  isMoving: boolean
  isSleeping: boolean
  direction: 'left' | 'right'
}

export default function AvatarRenderer({
  mood,
  isMoving,
  isSleeping,
  direction,
}: AvatarRendererProps) {
  // Simple emoji-based avatar for Phase 1
  // Will be replaced with Live2D or sprite animations in later phases
  
  const emoji = useMemo(() => {
    if (isSleeping) return '😴'
    if (isMoving) return '🐾'
    
    switch (mood) {
      case 'curious':
        return '🤔'
      case 'alert':
        return '👀'
      case 'bored':
        return '😑'
      case 'sleepy':
        return '🥱'
      default:
        return '😊'
    }
  }, [mood, isMoving, isSleeping])

  const animation = useMemo(() => {
    if (isSleeping) return 'animate-pulse-soft'
    if (isMoving) return 'animate-bounce-gentle'
    return 'animate-float'
  }, [isMoving, isSleeping])

  return (
    <div
      className={`relative select-none ${animation}`}
      style={{
        transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
      }}
    >
      {/* Avatar */}
      <div className="relative">
        <div className="text-6xl avatar-shadow transition-all duration-300 hover:scale-110">
          {emoji}
        </div>
        
        {/* Status indicator */}
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-background animate-pulse" />
      </div>

      {/* Thought bubble (occasional hints) */}
      {mood === 'curious' && !isMoving && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none animate-slide-up">
          <div className="px-3 py-1 rounded-full bg-card border border-border text-xs shadow-lg">
            💭
          </div>
        </div>
      )}
    </div>
  )
}
