import { useState, useEffect, useCallback, useRef } from 'react'
import type { AvatarState, AvatarConfig } from '@/types/avatar'

const SPEED = 2.5
const SAFE_DISTANCE_FROM_MOUSE = 150 // px
const FOLLOW_PROBABILITY = 0.25
const MOUSE_STOP_THRESHOLD = 400 // ms
const IDLE_ROAM_DELAY = 5000 // 5 seconds
const SLEEP_THRESHOLD = 5 * 60 * 1000 // 5 minutes

export function useAvatarBehaviorV2(config: AvatarConfig) {
  const [state, setState] = useState<AvatarState>(() => ({
    position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    targetPosition: null,
    mood: 'happy',
    energy: config.personality.energy,
    attention: 50,
    curiosity: config.personality.curiosity,
    isMoving: false,
    isSleeping: false,
    isListening: false,
    isSpeaking: false,
    direction: 'right',
    lastInteractionTime: Date.now(),
    lastMousePosition: null,
    userPresenceConfidence: 100,
    currentUrl: window.location.href,
    urlStartTime: Date.now(),
    idleTime: 0,
  }))

  const animationFrameRef = useRef<number>()
  const decisionTimerRef = useRef<NodeJS.Timeout>()
  const mouseStopTimerRef = useRef<NodeJS.Timeout>()
  const lastMouseMoveRef = useRef<number>(Date.now())

  // Calculate distance between two points
  const distance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Get safe position near mouse (not directly on it)
  const getSafePositionNearMouse = useCallback((mousePos: { x: number; y: number }) => {
    const angle = Math.random() * Math.PI * 2
    const dist = SAFE_DISTANCE_FROM_MOUSE + Math.random() * 50
    return {
      x: mousePos.x + Math.cos(angle) * dist,
      y: mousePos.y + Math.sin(angle) * dist,
    }
  }, [])

  // Update position towards target
  const updatePosition = useCallback(() => {
    setState(prev => {
      if (!prev.targetPosition || prev.isSleeping) return prev

      const dx = prev.targetPosition.x - prev.position.x
      const dy = prev.targetPosition.y - prev.position.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 5) {
        // Reached target
        return {
          ...prev,
          position: prev.targetPosition,
          targetPosition: null,
          isMoving: false,
        }
      }

      // Smooth curved movement with slight delay
      const speed = SPEED * (prev.energy / 100)
      const newX = prev.position.x + (dx / dist) * speed
      const newY = prev.position.y + (dy / dist) * speed

      return {
        ...prev,
        position: { x: newX, y: newY },
        isMoving: true,
        direction: dx > 0 ? 'right' : 'left',
      }
    })

    animationFrameRef.current = requestAnimationFrame(updatePosition)
  }, [])

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mousePos = { x: e.clientX, y: e.clientY }
      
      setState(prev => ({
        ...prev,
        lastMousePosition: mousePos,
        lastInteractionTime: Date.now(),
        isSleeping: false,
        userPresenceConfidence: Math.min(100, prev.userPresenceConfidence + 5),
      }))

      lastMouseMoveRef.current = Date.now()

      // Clear previous timer
      if (mouseStopTimerRef.current) {
        clearTimeout(mouseStopTimerRef.current)
      }

      // Set new timer for mouse stop detection
      mouseStopTimerRef.current = setTimeout(() => {
        setState(prev => {
          // Only follow if avatar is not already moving and random chance
          if (prev.isMoving || prev.isSleeping || prev.isListening || prev.isSpeaking) {
            return prev
          }

          const distToMouse = prev.lastMousePosition 
            ? distance(prev.position, prev.lastMousePosition)
            : Infinity

          // Follow mouse with probability based on curiosity and distance
          const followChance = (prev.curiosity / 100) * FOLLOW_PROBABILITY
          if (distToMouse < 300 && Math.random() < followChance) {
            const safeTarget = getSafePositionNearMouse(mousePos)
            return {
              ...prev,
              targetPosition: safeTarget,
              mood: 'curious',
              attention: Math.min(100, prev.attention + 20),
            }
          }

          return prev
        })
      }, MOUSE_STOP_THRESHOLD)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (mouseStopTimerRef.current) clearTimeout(mouseStopTimerRef.current)
    }
  }, [getSafePositionNearMouse])

  // Decision engine - runs every 2 seconds
  const makeDecision = useCallback(() => {
    const now = Date.now()
    
    setState(prev => {
      const timeSinceInteraction = now - prev.lastInteractionTime
      const timeOnUrl = now - prev.urlStartTime

      // Check if should sleep (5 minutes of inactivity)
      if (timeSinceInteraction > SLEEP_THRESHOLD && timeOnUrl > SLEEP_THRESHOLD) {
        return {
          ...prev,
          isSleeping: true,
          mood: 'sleepy',
          targetPosition: null,
          isMoving: false,
          energy: Math.max(20, prev.energy - 10),
          userPresenceConfidence: Math.max(0, prev.userPresenceConfidence - 10),
        }
      }

      // If sleeping, listening, or speaking, don't make movement decisions
      if (prev.isSleeping || prev.isListening || prev.isSpeaking) {
        return prev
      }

      // Decay energy and attention over time
      const newEnergy = Math.max(30, prev.energy - 1)
      const newAttention = Math.max(0, prev.attention - 2)
      const newPresence = Math.max(0, prev.userPresenceConfidence - 1)

      // Random roaming behavior (only if not moving and after idle delay)
      const timeSinceLastMove = now - lastMouseMoveRef.current
      if (!prev.targetPosition && timeSinceLastMove > IDLE_ROAM_DELAY) {
        const roamChance = (prev.energy / 100) * 0.3
        if (Math.random() < roamChance) {
          const padding = 100
          const newTarget = {
            x: padding + Math.random() * (window.innerWidth - padding * 2),
            y: padding + Math.random() * (window.innerHeight - padding * 2),
          }

          return {
            ...prev,
            targetPosition: newTarget,
            mood: Math.random() < 0.3 ? 'curious' : 'idle',
            energy: newEnergy,
            attention: newAttention,
            userPresenceConfidence: newPresence,
          }
        }
      }

      // Update mood based on state with more variety
      let newMood: AvatarState['mood'] = prev.mood
      const randomMoodChange = Math.random()
      
      if (timeSinceInteraction > 3 * 60 * 1000) {
        newMood = 'lazy'
      } else if (timeSinceInteraction > 2 * 60 * 1000) {
        newMood = randomMoodChange < 0.5 ? 'bored' : 'lazy'
      } else if (timeSinceInteraction < 30 * 1000) {
        newMood = randomMoodChange < 0.6 ? 'alert' : 'excited'
      } else if (newEnergy < 40) {
        newMood = 'sleepy'
      } else if (randomMoodChange < 0.1) {
        // Random mood changes for variety
        const moods: AvatarState['mood'][] = ['happy', 'curious', 'thinking', 'idle']
        newMood = moods[Math.floor(Math.random() * moods.length)]
      }

      return {
        ...prev,
        mood: newMood,
        energy: newEnergy,
        attention: newAttention,
        userPresenceConfidence: newPresence,
        idleTime: timeSinceInteraction,
      }
    })
  }, [])

  // Track user interactions to wake avatar
  useEffect(() => {
    const handleInteraction = () => {
      setState(prev => ({
        ...prev,
        lastInteractionTime: Date.now(),
        isSleeping: false,
        mood: 'alert',
        energy: Math.min(100, prev.energy + 10),
        attention: Math.min(100, prev.attention + 15),
        userPresenceConfidence: 100,
      }))
    }

    window.addEventListener('keydown', handleInteraction)
    window.addEventListener('click', handleInteraction)

    return () => {
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
        mood: 'curious',
        attention: Math.min(100, prev.attention + 30),
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
        setState(prev => ({ 
          ...prev, 
          mood: 'bored',
          userPresenceConfidence: Math.max(0, prev.userPresenceConfidence - 30),
        }))
      } else {
        setState(prev => ({
          ...prev,
          mood: 'alert',
          lastInteractionTime: Date.now(),
          isSleeping: false,
          userPresenceConfidence: 100,
        }))
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Methods to control avatar state
  const setListening = useCallback((listening: boolean) => {
    setState(prev => ({
      ...prev,
      isListening: listening,
      mood: listening ? 'listening' : 'alert',
      targetPosition: null, // Stop moving when listening
    }))
  }, [])

  const setSpeaking = useCallback((speaking: boolean) => {
    setState(prev => ({
      ...prev,
      isSpeaking: speaking,
      mood: speaking ? 'speaking' : 'alert',
    }))
  }, [])

  return {
    ...state,
    setListening,
    setSpeaking,
  }
}
