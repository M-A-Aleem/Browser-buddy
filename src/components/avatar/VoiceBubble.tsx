import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VoiceBubbleProps {
  position: { x: number; y: number }
  isListening: boolean
  isSpeaking: boolean
  transcript: string
  volume: number
  onMicClick: () => void
  onClose: () => void
}

export default function VoiceBubble({
  position,
  isListening,
  isSpeaking,
  transcript,
  volume,
  onMicClick,
  onClose,
}: VoiceBubbleProps) {
  // Position voice bubble near avatar
  const bubblePosition = {
    left: Math.min(position.x + 80, window.innerWidth - 320),
    top: Math.max(position.y - 80, 20),
  }

  return (
    <div
      className="fixed z-[10000] animate-slide-up"
      style={{
        left: `${bubblePosition.left}px`,
        top: `${bubblePosition.top}px`,
      }}
    >
      <div className="glass rounded-2xl shadow-2xl p-6 w-80">
        {/* Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isListening && (
              <>
                <Mic className="w-4 h-4 text-red-500 animate-pulse" />
                <span className="text-sm font-medium">Listening...</span>
              </>
            )}
            {isSpeaking && (
              <>
                <Volume2 className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-medium">Speaking...</span>
              </>
            )}
            {!isListening && !isSpeaking && (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-muted-foreground">Ready to chat</span>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            Close
          </button>
        </div>

        {/* Waveform visualization */}
        {isSpeaking && (
          <div className="flex items-center justify-center gap-1 h-16 mb-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-primary rounded-full transition-all duration-100"
                style={{
                  height: `${20 + Math.sin(Date.now() / 100 + i) * volume * 30}%`,
                }}
              />
            ))}
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div className="mb-4 p-3 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground italic">"{transcript}"</p>
          </div>
        )}

        {/* Push-to-talk button */}
        <div className="flex flex-col gap-3">
          <Button
            className="w-full gap-2"
            size="lg"
            variant={isListening ? 'destructive' : 'default'}
            onClick={onMicClick}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Push to Talk
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            {isListening 
              ? 'Speak now...' 
              : 'Click and speak, or close to return to roaming mode'
            }
          </p>
        </div>

        {/* Privacy note */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            🔒 Voice processing happens locally. Nothing is recorded or transmitted.
          </p>
        </div>
      </div>
    </div>
  )
}
