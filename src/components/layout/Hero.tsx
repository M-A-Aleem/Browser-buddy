import { Sparkles, Chrome, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroProps {
  onToggleAvatar: () => void
}

export default function Hero({ onToggleAvatar }: HeroProps) {
  return (
    <section className="relative overflow-hidden gradient-mesh">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-slide-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Phase 1 - Now Live</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Meet Your
            <br />
            <span className="gradient-text">Browser Companion</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
            An intelligent, animated avatar that roams your screen, reacts to your activity, 
            and chats with you. Privacy-first, playful, and always by your side.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" className="gap-2 text-lg px-8">
              <Chrome className="w-5 h-5" />
              Add to Chrome
            </Button>
            <Button size="lg" variant="outline" className="gap-2 text-lg px-8">
              <Code2 className="w-5 h-5" />
              Embed on Site
            </Button>
          </div>

          {/* Demo toggle */}
          <button
            onClick={onToggleAvatar}
            className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors underline animate-slide-up"
            style={{ animationDelay: '0.4s' }}
          >
            Toggle Demo Avatar
          </button>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full">
            {[
              { icon: '🎮', title: 'Autonomous Roaming', desc: 'Moves freely and naturally across your viewport' },
              { icon: '💬', title: 'Voice & Text Chat', desc: 'Click to talk with voice and text support' },
              { icon: '🔒', title: 'Privacy First', desc: 'No page scraping, all processing local' },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all animate-slide-up"
                style={{ animationDelay: `${0.5 + i * 0.1}s` }}
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50 animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: '1s' }} />
    </section>
  )
}
