import { useEffect, useRef, useState } from 'react'
import { useAvatarBehaviorV2 } from '@/hooks/useAvatarBehaviorV2'
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction'
import { useScreenShareDetection } from '@/hooks/useScreenShareDetection'
import AvatarRendererV2 from './AvatarRendererV2'
import VoiceBubble from './VoiceBubble'
import type { AvatarConfig } from '@/types/avatar'

interface AvatarOverlayV2Props {
  config: AvatarConfig
  isVisible: boolean
}

export default function AvatarOverlayV2({ config, isVisible }: AvatarOverlayV2Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showVoiceBubble, setShowVoiceBubble] = useState(false)
  
  const {
    position,
    mood,
    isMoving,
    isSleeping,
    isListening: behaviorListening,
    isSpeaking: behaviorSpeaking,
    direction,
    idleTime,
    setListening,
    setSpeaking,
  } = useAvatarBehaviorV2(config)

  const {
    isListening: voiceListening,
    isSpeaking: voiceSpeaking,
    transcript,
    volume,
    startListening,
    stopListening,
  } = useVoiceInteraction({
    config,
    onListeningChange: setListening,
    onSpeakingChange: setSpeaking,
  })

  const { isScreenSharing } = useScreenShareDetection()

  const handleAvatarClick = () => {
    setShowVoiceBubble(!showVoiceBubble)
  }

  const handleMicClick = () => {
    if (voiceListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  // Hide avatar during screen sharing
  const shouldHide = isScreenSharing || !isVisible

  if (shouldHide) {
    return null
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
          opacity: shouldHide ? 0 : 1,
        }}
      >
        <div
          className="pointer-events-auto cursor-pointer"
          onClick={handleAvatarClick}
          title="Click to talk"
        >
          <AvatarRendererV2
            skin={config.skin}
            customImage={config.customImage}
            mood={mood}
            isMoving={isMoving}
            isSleeping={isSleeping}
            isListening={behaviorListening}
            isSpeaking={behaviorSpeaking}
            direction={direction}
            volume={volume}
            idleTime={idleTime}
          />
        </div>
      </div>

      {/* Voice bubble */}
      {showVoiceBubble && (
        <VoiceBubble
          position={position}
          isListening={voiceListening}
          isSpeaking={voiceSpeaking}
          transcript={transcript}
          volume={volume}
          onMicClick={handleMicClick}
          onClose={() => setShowVoiceBubble(false)}
        />
      )}
    </>
  )
}
