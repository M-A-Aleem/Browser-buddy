import { Lock, Eye, Mic, Database, Shield, Power } from 'lucide-react'

const privacyPoints = [
  {
    icon: Lock,
    title: 'No Page Scraping',
    description: 'Never reads or transmits your page content or DOM. Only observes high-level browser signals.',
  },
  {
    icon: Mic,
    title: 'Permission on Demand',
    description: 'Microphone access only requested when you click the mic button. No background listening.',
  },
  {
    icon: Database,
    title: 'Local Processing',
    description: 'Decision engine runs entirely in your browser. No server-side tracking of your behavior.',
  },
  {
    icon: Eye,
    title: 'Minimal Permissions',
    description: 'Extension only requests activeTab permission. No broad access to your browsing history.',
  },
  {
    icon: Shield,
    title: 'Opt-in Telemetry',
    description: 'All analytics and error reporting are opt-in and fully anonymized. Your choice, always.',
  },
  {
    icon: Power,
    title: 'Kill Switch',
    description: 'Instantly hide and disable the companion with one click. Full control in your hands.',
  },
]

export default function Privacy() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Privacy First</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your Data Stays <span className="gradient-text">Yours</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built from the ground up with privacy as a core principle, not an afterthought
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {privacyPoints.map((point, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-card border border-border hover:border-green-500/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-green-500/10 flex-shrink-0">
                  <point.icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{point.title}</h3>
                  <p className="text-sm text-muted-foreground">{point.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-12 max-w-3xl mx-auto p-6 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-3">Privacy Commitment</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We believe your digital companion should enhance your browsing experience without 
            compromising your privacy. Every feature is designed with explicit consent, minimal 
            data collection, and transparent operation. Read our full{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a> and{' '}
            <a href="#" className="text-primary hover:underline">Security Documentation</a>.
          </p>
        </div>
      </div>
    </section>
  )
}
