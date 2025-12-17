import { Eye, Brain, Zap, Palette, Shield, Activity } from 'lucide-react'

const features = [
  {
    icon: Eye,
    title: 'Perception Engine',
    description: 'Observes tab visibility, page activity, mouse position, and time spent to react naturally to your browsing habits.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Brain,
    title: 'Decision Brain',
    description: 'Runs every 1-3 seconds with deterministic state machine: mood, energy, attention tracking for natural behaviors.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Zap,
    title: 'Smart Behaviors',
    description: 'Idle roaming, mouse following, sleep after inactivity, wake on interaction, and occasional helpful hints.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Palette,
    title: 'Multiple Skins',
    description: 'Choose from built-in avatars or upload your own. Live2D and sprite-sheet support with lip-sync animations.',
    gradient: 'from-green-500 to-teal-500',
  },
  {
    icon: Shield,
    title: 'Privacy Focused',
    description: 'Zero page scraping. Only observes high-level signals. Microphone access only when you click the mic button.',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Activity,
    title: 'Lightweight',
    description: '<5% CPU on idle, <10ms per animation tick. Optimized with requestAnimationFrame for smooth 60fps movement.',
    gradient: 'from-pink-500 to-rose-500',
  },
]

export default function Features() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built with <span className="gradient-text">Intelligence</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced perception and decision-making systems create a companion that feels alive
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
