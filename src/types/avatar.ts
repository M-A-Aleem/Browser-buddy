export type AvatarSkin = 'cat' | 'dog' | 'robot' | 'bunny' | 'dragon' | 'bear' | 'fox' | 'panda' | 'koala' | 'tiger' | 'custom'

export interface AvatarConfig {
  skin: AvatarSkin
  personality: {
    talkativeness: number // 0-100
    curiosity: number // 0-100
    energy: number // 0-100
  }
  customImage?: string
}

export interface AvatarState {
  position: { x: number; y: number }
  targetPosition: { x: number; y: number } | null
  mood: 'idle' | 'curious' | 'alert' | 'bored' | 'sleepy' | 'listening' | 'speaking' | 'excited' | 'thinking' | 'lazy' | 'happy' | 'confused'
  energy: number // 0-100
  attention: number // 0-100
  curiosity: number // 0-100
  isMoving: boolean
  isSleeping: boolean
  isListening: boolean
  isSpeaking: boolean
  direction: 'left' | 'right'
  lastInteractionTime: number
  lastMousePosition: { x: number; y: number } | null
  userPresenceConfidence: number // 0-100
  currentUrl: string
  urlStartTime: number
  idleTime: number // ms since last significant activity
}

export interface VoiceState {
  isListening: boolean
  isSpeaking: boolean
  transcript: string
  volume: number
}

// Massive emoji collection for reactions
export const AVATAR_EMOJIS = {
  // Animals
  animals: ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐣', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️'],
  
  // Face reactions
  happy: ['😊', '😀', '😃', '😄', '😁', '😆', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲'],
  thinking: ['🤔', '🧐', '🤨', '🤓', '😐', '😑', '😶'],
  excited: ['🤗', '🤭', '🤫', '🤥', '😬', '😏', '😌', '😔'],
  lazy: ['😪', '😴', '🥱', '😑', '😐', '😶', '🫥'],
  confused: ['😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢'],
  alert: ['👀', '👁️', '🧿', '😳', '😲'],
  bored: ['😑', '😐', '🙄', '😒', '😶'],
  curious: ['🤔', '🧐', '👀', '🤨'],
  
  // Actions
  listening: ['👂', '🎧', '🔊', '📻'],
  speaking: ['🗣️', '💬', '💭', '🗨️', '💡'],
  
  // Status indicators
  sleeping: ['😴', '💤', '🛌'],
  walking: ['🐾', '👣', '🚶'],
  
  // Emotions
  love: ['❤️', '💕', '💖', '💗', '💓', '💝', '💘'],
  star: ['⭐', '🌟', '✨', '💫', '⚡'],
}

export const AVATAR_SKINS: Record<AvatarSkin, {
  emoji: string
  name: string
  description: string
  voicePitch: number
  voiceSpeed: number
}> = {
  cat: {
    emoji: '🐱',
    name: 'Curious Cat',
    description: 'Playful and observant',
    voicePitch: 1.2,
    voiceSpeed: 1.1,
  },
  dog: {
    emoji: '🐶',
    name: 'Loyal Dog',
    description: 'Energetic and friendly',
    voicePitch: 0.9,
    voiceSpeed: 1.2,
  },
  robot: {
    emoji: '🤖',
    name: 'Smart Robot',
    description: 'Efficient and helpful',
    voicePitch: 0.8,
    voiceSpeed: 1.0,
  },
  bunny: {
    emoji: '🐰',
    name: 'Gentle Bunny',
    description: 'Calm and thoughtful',
    voicePitch: 1.3,
    voiceSpeed: 0.9,
  },
  dragon: {
    emoji: '🐉',
    name: 'Wise Dragon',
    description: 'Ancient and knowledgeable',
    voicePitch: 0.7,
    voiceSpeed: 0.8,
  },
  bear: {
    emoji: '🐻',
    name: 'Friendly Bear',
    description: 'Warm and caring',
    voicePitch: 0.8,
    voiceSpeed: 0.9,
  },
  fox: {
    emoji: '🦊',
    name: 'Clever Fox',
    description: 'Smart and witty',
    voicePitch: 1.1,
    voiceSpeed: 1.1,
  },
  panda: {
    emoji: '🐼',
    name: 'Chill Panda',
    description: 'Relaxed and peaceful',
    voicePitch: 0.9,
    voiceSpeed: 0.85,
  },
  koala: {
    emoji: '🐨',
    name: 'Sleepy Koala',
    description: 'Calm and easygoing',
    voicePitch: 1.0,
    voiceSpeed: 0.8,
  },
  tiger: {
    emoji: '🐯',
    name: 'Bold Tiger',
    description: 'Confident and strong',
    voicePitch: 0.85,
    voiceSpeed: 1.0,
  },
  custom: {
    emoji: '✨',
    name: 'Custom Avatar',
    description: 'Your own creation',
    voicePitch: 1.0,
    voiceSpeed: 1.0,
  },
}

// Get random emoji from a category
export function getRandomEmoji(category: keyof typeof AVATAR_EMOJIS): string {
  const emojis = AVATAR_EMOJIS[category]
  return emojis[Math.floor(Math.random() * emojis.length)]
}

// Get mood-based emoji
export function getMoodEmoji(mood: AvatarState['mood'], isMoving: boolean, isSleeping: boolean): string {
  if (isSleeping) return getRandomEmoji('sleeping')
  if (isMoving) return getRandomEmoji('walking')
  
  switch (mood) {
    case 'listening':
      return getRandomEmoji('listening')
    case 'speaking':
      return getRandomEmoji('speaking')
    case 'happy':
    case 'excited':
      return getRandomEmoji('excited')
    case 'thinking':
      return getRandomEmoji('thinking')
    case 'lazy':
      return getRandomEmoji('lazy')
    case 'confused':
      return getRandomEmoji('confused')
    case 'curious':
      return getRandomEmoji('curious')
    case 'alert':
      return getRandomEmoji('alert')
    case 'bored':
      return getRandomEmoji('bored')
    default:
      return getRandomEmoji('happy')
  }
}
