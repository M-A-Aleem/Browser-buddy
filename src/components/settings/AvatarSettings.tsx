import { useState } from 'react'
import { Settings, X, Upload, Shield, Power } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import type { AvatarConfig, AvatarSkin } from '@/types/avatar'
import { AVATAR_SKINS } from '@/types/avatar'

interface AvatarSettingsProps {
  config: AvatarConfig
  isVisible: boolean
  onConfigChange: (config: AvatarConfig) => void
  onVisibilityChange: (visible: boolean) => void
  onClose: () => void
}

export default function AvatarSettings({
  config,
  isVisible,
  onConfigChange,
  onVisibilityChange,
  onClose,
}: AvatarSettingsProps) {
  const [localConfig, setLocalConfig] = useState(config)

  const handleSkinChange = (skin: AvatarSkin) => {
    const newConfig = { ...localConfig, skin }
    setLocalConfig(newConfig)
    onConfigChange(newConfig)
  }

  const handlePersonalityChange = (key: keyof typeof localConfig.personality, value: number) => {
    const newConfig = {
      ...localConfig,
      personality: {
        ...localConfig.personality,
        [key]: value,
      },
    }
    setLocalConfig(newConfig)
    onConfigChange(newConfig)
  }

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newConfig = {
          ...localConfig,
          skin: 'custom' as AvatarSkin,
          customImage: event.target?.result as string,
        }
        setLocalConfig(newConfig)
        onConfigChange(newConfig)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[10001] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Avatar Settings</h2>
              <p className="text-sm text-muted-foreground">Customize your companion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Avatar Skins */}
          <div>
            <h3 className="font-semibold mb-4">Choose Avatar</h3>
            <div className="grid grid-cols-4 gap-3">
              {(Object.keys(AVATAR_SKINS) as AvatarSkin[])
                .filter(skin => skin !== 'custom')
                .map(skin => (
                  <button
                    key={skin}
                    onClick={() => handleSkinChange(skin)}
                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                      localConfig.skin === skin
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{AVATAR_SKINS[skin].emoji}</div>
                    <div className="text-xs font-medium">{AVATAR_SKINS[skin].name}</div>
                  </button>
                ))}
            </div>

            {/* Custom Upload */}
            <div className="mt-4">
              <label className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-all cursor-pointer">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Upload Custom Avatar</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={handleCustomImageUpload}
                  className="hidden"
                />
              </label>
              {localConfig.skin === 'custom' && localConfig.customImage && (
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-8 h-8 rounded border border-border overflow-hidden">
                    <img
                      src={localConfig.customImage}
                      alt="Custom avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span>Custom avatar uploaded</span>
                </div>
              )}
            </div>
          </div>

          {/* Personality Sliders */}
          <div>
            <h3 className="font-semibold mb-4">Personality</h3>
            <div className="space-y-6">
              {/* Talkativeness */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Talkativeness</label>
                  <span className="text-xs text-muted-foreground">
                    {localConfig.personality.talkativeness < 33 ? 'Quiet' :
                     localConfig.personality.talkativeness < 67 ? 'Balanced' : 'Chatty'}
                  </span>
                </div>
                <Slider
                  value={[localConfig.personality.talkativeness]}
                  onValueChange={([value]) => handlePersonalityChange('talkativeness', value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Curiosity */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Curiosity</label>
                  <span className="text-xs text-muted-foreground">
                    {localConfig.personality.curiosity < 33 ? 'Observer' :
                     localConfig.personality.curiosity < 67 ? 'Interested' : 'Very Curious'}
                  </span>
                </div>
                <Slider
                  value={[localConfig.personality.curiosity]}
                  onValueChange={([value]) => handlePersonalityChange('curiosity', value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Energy */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Energy Level</label>
                  <span className="text-xs text-muted-foreground">
                    {localConfig.personality.energy < 33 ? 'Calm' :
                     localConfig.personality.energy < 67 ? 'Moderate' : 'Energetic'}
                  </span>
                </div>
                <Slider
                  value={[localConfig.personality.energy]}
                  onValueChange={([value]) => handlePersonalityChange('energy', value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div>
            <h3 className="font-semibold mb-4">Controls</h3>
            <div className="space-y-3">
              <Button
                variant={isVisible ? 'outline' : 'default'}
                className="w-full justify-start gap-2"
                onClick={() => onVisibilityChange(!isVisible)}
              >
                <Power className="w-4 h-4" />
                {isVisible ? 'Hide Avatar' : 'Show Avatar'}
              </Button>
            </div>
          </div>

          {/* Privacy Info */}
          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Privacy First</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• No page content reading or DOM scraping</li>
                  <li>• Voice processed locally, nothing transmitted</li>
                  <li>• Microphone access only when you click</li>
                  <li>• Auto-hides during screen sharing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
