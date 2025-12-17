import { useState, useCallback, useRef, useEffect } from 'react'
import type { AvatarConfig } from '@/types/avatar'

interface VoiceInteractionProps {
  config: AvatarConfig
  onListeningChange: (listening: boolean) => void
  onSpeakingChange: (speaking: boolean) => void
}

export function useVoiceInteraction({ 
  config, 
  onListeningChange, 
  onSpeakingChange 
}: VoiceInteractionProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [volume, setVolume] = useState(0)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Initialize Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex
        const transcriptText = event.results[current][0].transcript
        setTranscript(transcriptText)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        onListeningChange(false)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        onListeningChange(false)
      }
    }
  }, [onListeningChange])

  // Start listening
  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        setTranscript('')
        recognitionRef.current.start()
        setIsListening(true)
        onListeningChange(true)
      } catch (error) {
        console.error('Error starting speech recognition:', error)
      }
    }
  }, [onListeningChange])

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      onListeningChange(false)
    }
  }, [onListeningChange])

  // Speak text
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      
      // Apply avatar voice settings
      const skinConfig = config.skin !== 'custom' 
        ? require('@/types/avatar').AVATAR_SKINS[config.skin]
        : { voicePitch: 1.0, voiceSpeed: 1.0 }

      const { AVATAR_SKINS } = require('@/types/avatar')
      const skinData = AVATAR_SKINS[config.skin] || { voicePitch: 1.0, voiceSpeed: 1.0 }
      
      utterance.pitch = skinData.voicePitch
      utterance.rate = skinData.voiceSpeed
      utterance.volume = 1.0

      utterance.onstart = () => {
        setIsSpeaking(true)
        onSpeakingChange(true)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        onSpeakingChange(false)
      }

      utterance.onerror = () => {
        setIsSpeaking(false)
        onSpeakingChange(false)
      }

      // Simulate volume changes for lip-sync visualization
      const volumeInterval = setInterval(() => {
        setVolume(Math.random() * 0.5 + 0.5) // Random volume 0.5-1.0
      }, 100)

      utterance.onend = () => {
        clearInterval(volumeInterval)
        setVolume(0)
        setIsSpeaking(false)
        onSpeakingChange(false)
      }

      synthesisRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }
  }, [config, onSpeakingChange])

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setVolume(0)
      onSpeakingChange(false)
    }
  }, [onSpeakingChange])

  // Generate simple response (Phase 2 - will be upgraded with AI later)
  const generateResponse = useCallback((userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    
    // Simple pattern matching responses
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      const greetings = [
        "Hello! Nice to see you!",
        "Hey there! How's it going?",
        "Hi! What's up?",
        "Hello friend! Great to chat with you!"
      ]
      return greetings[Math.floor(Math.random() * greetings.length)]
    }
    if (lowerInput.includes('how are you') || lowerInput.includes('how r u')) {
      const statusResponses = [
        "I'm doing great! Thanks for asking!",
        "I'm awesome! How about you?",
        "Feeling energetic and ready to chat!",
        "Doing wonderful! It's nice of you to ask!"
      ]
      return statusResponses[Math.floor(Math.random() * statusResponses.length)]
    }
    if (lowerInput.includes('what') && (lowerInput.includes('name') || lowerInput.includes('called'))) {
      return `I'm your ${config.skin} companion! You can call me whatever you like!`
    }
    if (lowerInput.includes('help')) {
      return "I'm here to keep you company while you browse. Just click on me anytime you want to chat!"
    }
    if (lowerInput.includes('bye') || lowerInput.includes('goodbye') || lowerInput.includes('see you')) {
      const farewells = [
        "See you later! I'll be here if you need me.",
        "Goodbye! Take care!",
        "Catch you later!",
        "Bye! I'll be around if you want to chat again!"
      ]
      return farewells[Math.floor(Math.random() * farewells.length)]
    }
    if (lowerInput.includes('thank') || lowerInput.includes('thanks')) {
      return "You're welcome! Happy to help!"
    }
    if (lowerInput.includes('joke') || lowerInput.includes('funny')) {
      const jokes = [
        "Why don't programmers like nature? It has too many bugs!",
        "What do you call a bear with no teeth? A gummy bear!",
        "I'm not very good at jokes, but I'm great at being cute!"
      ]
      return jokes[Math.floor(Math.random() * jokes.length)]
    }
    if (lowerInput.includes('tired') || lowerInput.includes('sleepy') || lowerInput.includes('sleep')) {
      return "Same here! Maybe we both need a little rest. Want me to take a nap with you?"
    }
    if (lowerInput.includes('bored') || lowerInput.includes('boring')) {
      return "I know the feeling! Let's do something fun! Want to hear a joke or just chat?"
    }
    
    // Default responses based on personality
    const defaultResponses = [
      "That's interesting!",
      "I see what you mean.",
      "Tell me more about that!",
      "Hmm, let me think about that.",
      "I'm listening!",
      "That's a good point!",
      "Wow, really?",
      "I hadn't thought of it that way!",
      "Fascinating!",
      "Oh, I like that!"
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }, [config.skin])

  // Process user input
  const processInput = useCallback((text: string) => {
    if (!text.trim()) return

    const response = generateResponse(text)
    
    // Speak the response
    setTimeout(() => {
      speak(response)
    }, 300)
  }, [generateResponse, speak])

  // When transcript changes and is final, process it
  useEffect(() => {
    if (transcript && !isListening) {
      processInput(transcript)
    }
  }, [transcript, isListening, processInput])

  return {
    isListening,
    isSpeaking,
    transcript,
    volume,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  }
}
