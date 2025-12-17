import { useEffect, useRef, useState } from 'react'
import { useAvatarBehavior } from '@/hooks/useAvatarBehavior'
import AvatarRenderer from './AvatarRenderer'
import ChatBubble from './ChatBubble'

export default function AvatarOverlay() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showChat, setShowChat] = useState(false)
  
  const {
    position,
    mood,
    isMoving,
    isSleeping,
    direction,
  } = useAvatarBehavior()

  const handleAvatarClick = () => {
    setShowChat(!showChat)
  }

  return (
    <>
      {/* Avatar */}
      <div
        ref={containerRef}
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
          transition: isMoving ? 'none' : 'left 0.3s ease-out, top 0.3s ease-out',
        }}
      >
        <div
          className="pointer-events-auto cursor-pointer"
          onClick={handleAvatarClick}
        >
          <AvatarRenderer
            mood={mood}
            isMoving={isMoving}
            isSleeping={isSleeping}
            direction={direction}
          />
        </div>
      </div>

      {/* Chat bubble */}
      {showChat && (
        <ChatBubble
          position={position}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  )
}
