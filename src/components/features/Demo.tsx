import { Code, Download, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Demo() {
  const embedCode = `<!-- Add to your website -->
<script src="https://cdn.avataragent.ai/widget.js"></script>
<script>
  AvatarAgent.init({
    avatar: 'cat',
    position: 'bottom-right',
    behavior: 'playful'
  });
</script>`

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Try It <span className="gradient-text">Right Now</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See the avatar in action on this page, or embed it on your own site
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Extension card */}
          <div className="p-8 rounded-2xl bg-card border border-border">
            <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Chrome Extension</h3>
            <p className="text-muted-foreground mb-6">
              Install the browser extension to have your companion on every website you visit.
              Works across all your tabs with smart context awareness.
            </p>
            <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Cross-site companion
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Manifest v3 (latest security)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Active tab permissions only
              </li>
            </ul>
            <Button className="w-full">Install Extension</Button>
          </div>

          {/* Embed card */}
          <div className="p-8 rounded-2xl bg-card border border-border">
            <div className="inline-flex p-3 rounded-xl bg-secondary/10 mb-4">
              <Code className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Embed Widget</h3>
            <p className="text-muted-foreground mb-6">
              Add the companion to your website with just 2 lines of code.
              Perfect for product demos, landing pages, or customer support.
            </p>
            <div className="relative mb-6">
              <pre className="p-4 rounded-lg bg-muted text-xs overflow-x-auto">
                <code>{embedCode}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => navigator.clipboard.writeText(embedCode)}
              >
                Copy
              </Button>
            </div>
            <Button variant="outline" className="w-full">View Docs</Button>
          </div>
        </div>

        {/* Settings preview */}
        <div className="mt-16 max-w-3xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Customizable Settings</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-lg bg-card">
              <div className="font-medium mb-1">Avatar Skins</div>
              <div className="text-muted-foreground">Cat, Dog, Robot + Custom uploads</div>
            </div>
            <div className="p-4 rounded-lg bg-card">
              <div className="font-medium mb-1">Behavior Modes</div>
              <div className="text-muted-foreground">Shy, Balanced, Playful</div>
            </div>
            <div className="p-4 rounded-lg bg-card">
              <div className="font-medium mb-1">Movement</div>
              <div className="text-muted-foreground">Toggle roaming & following</div>
            </div>
            <div className="p-4 rounded-lg bg-card">
              <div className="font-medium mb-1">Voice Settings</div>
              <div className="text-muted-foreground">TTS voice & speed control</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
