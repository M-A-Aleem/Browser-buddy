import { useState } from 'react'
import { Settings as SettingsIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Hero from './components/layout/Hero'
import Features from './components/features/Features'
import Demo from './components/features/Demo'
import Privacy from './components/features/Privacy'
import Footer from './components/layout/Footer'
import AvatarOverlayV2 from './components/avatar/AvatarOverlayV2'
import AvatarSettings from './components/settings/AvatarSettings'
import type { AvatarConfig } from './types/avatar'

function App() {
  const [showAvatar, setShowAvatar] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
    skin: 'cat',
    personality: {
      talkativeness: 50,
      curiosity: 70,
      energy: 60,
    },
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Avatar Overlay */}
      <AvatarOverlayV2 config={avatarConfig} isVisible={showAvatar} />
      
      {/* Settings Button (Floating) */}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 z-[9998] rounded-full shadow-lg"
        onClick={() => setShowSettings(true)}
      >
        <SettingsIcon className="w-5 h-5" />
      </Button>

      {/* Settings Panel */}
      {showSettings && (
        <AvatarSettings
          config={avatarConfig}
          isVisible={showAvatar}
          onConfigChange={setAvatarConfig}
          onVisibilityChange={setShowAvatar}
          onClose={() => setShowSettings(false)}
        />
      )}
      
      {/* Landing Page */}
      <Hero onToggleAvatar={() => setShowAvatar(!showAvatar)} />
      <Features />
      <Demo />
      <Privacy />
      <Footer />
    </div>
  )
}

export default App
