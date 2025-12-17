import { useState, useEffect, useCallback, useRef } from 'react'

interface Position {
  x: number
  y: number
}

interface AvatarState {
  position: Position
  targetPosition: Position | null
  mood: 'idle' | 'curious' | 'alert' | 'bored' | 'sleepy'
  energy: number
  isMoving: boolean
  isSleeping: boolean
  direction: 'left' | 'right'
  lastInteractionTime: number
  currentUrl: string
  urlStartTime: number
}

export function useAvatarBehavior() {
  const [state, setState] = useState<AvatarState>(() => ({
    position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    targetPosition: null,
    mood: 'idle',
    energy: 100,
    isMoving: false,
    isSleeping: false,
    direction: 'right',
    lastInteractionTime: Date.now(),
    currentUrl: window.location.href,
    urlStartTime: Date.now(),
  }))

  const animationFrameRef = useRef<number>()
  const decisionTimerRef = useRef<NodeJS.Timeout>()

  // Movement speed (pixels per frame)
  const SPEED = 2

  // Update position towards target
  const updatePosition = useCallback(() => {
    setState(prev => {
      if (!prev.targetPosition || prev.isSleeping) return prev

      const dx = prev.targetPosition.x - prev.position.x
      const dy = prev.targetPosition.y - prev.position.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 5) {
        // Reached target
        return {
          ...prev,
          position: prev.targetPosition,
          targetPosition: null,
          isMoving: false,
        }
      }

      // Move towards target
      const newX = prev.position.x + (dx / distance) * SPEED
      const newY = prev.position.y + (dy / distance) * SPEED

      return {
        ...prev,
        position: { x: newX, y: newY },
        isMoving: true,
        direction: dx > 0 ? 'right' : 'left',
      }
    })

    animationFrameRef.current = requestAnimationFrame(updatePosition)
  }, [])

  // Decision engine - runs every 2 seconds
  const makeDecision = useCallback(() => {
    const now = Date.now()
    const timeSinceInteraction = now - state.lastInteractionTime
    const timeOnUrl = now - state.urlStartTime

    setState(prev => {
      // Check if should sleep (5 minutes of inactivity)
      if (timeSinceInteraction > 5 * 60 * 1000 && timeOnUrl > 5 * 60 * 1000) {
        return {
          ...prev,
          isSleeping: true,
          mood: 'sleepy',
          targetPosition: null,
          isMoving: false,
        }
      }

      // If sleeping, don't make decisions
      if (prev.isSleeping) return prev

      // Random roaming behavior
      if (!prev.targetPosition && Math.random() < 0.3) {
        const padding = 100
        const newTarget = {
          x: padding + Math.random() * (window.innerWidth - padding * 2),
          y: padding + Math.random() * (window.innerHeight - padding * 2),
        }

        return {
          ...prev,
          targetPosition: newTarget,
          mood: Math.random() < 0.2 ? 'curious' : 'idle',
        }
      }

      // Update mood based on time
      let newMood = prev.mood
      if (timeSinceInteraction > 2 * 60 * 1000) {
        newMood = 'bored'
      } else if (timeSinceInteraction < 30 * 1000) {
        newMood = 'alert'
      }

      return {
        ...prev,
        mood: newMood,
      }
    })
  }, [state.lastInteractionTime, state.urlStartTime])

  // Track user interactions to wake avatar
  useEffect(() => {
    const handleInteraction = () => {
      setState(prev => ({
        ...prev,
        lastInteractionTime: Date.now(),
        isSleeping: false,
        mood: 'alert',
      }))
    }

    window.addEventListener('mousemove', handleInteraction)
    window.addEventListener('keydown', handleInteraction)
    window.addEventListener('click', handleInteraction)

    return () => {
      window.removeEventListener('mousemove', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
      window.removeEventListener('click', handleInteraction)
    }
  }, [])

  // Track URL changes
  useEffect(() => {
    const currentUrl = window.location.href
    if (currentUrl !== state.currentUrl) {
      setState(prev => ({
        ...prev,
        currentUrl,
        urlStartTime: Date.now(),
      }))
    }
  }, [state.currentUrl])

  // Animation loop
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updatePosition)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [updatePosition])

  // Decision loop
  useEffect(() => {
    decisionTimerRef.current = setInterval(makeDecision, 2000)
    return () => {
      if (decisionTimerRef.current) {
        clearInterval(decisionTimerRef.current)
      }
    }
  }, [makeDecision])

  // Track page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setState(prev => ({ ...prev, mood: 'bored' }))
      } else {
        setState(prev => ({
          ...prev,
          mood: 'alert',
          lastInteractionTime: Date.now(),
          isSleeping: false,
        }))
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return state
}
