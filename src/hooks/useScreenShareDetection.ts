import { useState, useEffect } from 'react'

export function useScreenShareDetection() {
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  useEffect(() => {
    // Method 1: Check for screen capture API
    const checkScreenCapture = async () => {
      try {
        // This is a heuristic - we can't directly detect if someone else is capturing
        // But we can detect if THIS page is being captured
        if ('getDisplayMedia' in navigator.mediaDevices) {
          // Monitor for the user's own screen sharing
          const checkInterval = setInterval(() => {
            // In a real implementation, this would integrate with the extension
            // to detect when screen sharing is active
            // For now, we'll provide a manual control
          }, 1000)

          return () => clearInterval(checkInterval)
        }
      } catch (error) {
        console.error('Screen share detection error:', error)
      }
    }

    checkScreenCapture()

    // Method 2: Listen for custom events (from extension or user control)
    const handleScreenShareStart = () => setIsScreenSharing(true)
    const handleScreenShareEnd = () => setIsScreenSharing(false)

    window.addEventListener('screenshare:start', handleScreenShareStart)
    window.addEventListener('screenshare:end', handleScreenShareEnd)

    return () => {
      window.removeEventListener('screenshare:start', handleScreenShareStart)
      window.removeEventListener('screenshare:end', handleScreenShareEnd)
    }
  }, [])

  return {
    isScreenSharing,
    setIsScreenSharing, // Manual control for testing
  }
}
