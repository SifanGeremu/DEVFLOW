import { Link } from "react-router-dom";
import { Zap, ArrowRight, CheckCircle2, Sparkles, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Roadmaps",
    description: "Get personalized learning paths tailored to your goals and skill level.",
  },
  {
    icon: Target,
    title: "Daily Focus",
    description: "Stay on track with curated tasks that respect your available time.",
  },
  {
    icon: TrendingUp,
    title: "Real Progress",
    description: "Track your momentum and celebrate wins with visual progress insights.",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--accent)/0.08)_0%,_transparent_50%)]" />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <Zap size={20} className="text-accent-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">DevFlow</span>
        </div>
        <Link to="/onboarding">
          <Button variant="ghost" size="sm">
            Sign in <ArrowRight size={16} />
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="animate-fade-in-up max-w-4xl text-center" style={{ animationDelay: "0.1s" }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent">
            <Sparkles size={14} />
            <span>Built for developers who ship</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            Finish What You{" "}
            <span className="bg-gradient-to-r from-accent to-emerald-400 bg-clip-text text-transparent">
              Start
            </span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground lg:text-xl">
            AI-powered roadmaps. Daily focus. Real progress.
            <br className="hidden sm:block" />
            Build momentum and level up as a developer.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/onboarding">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 pb-24 lg:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card-surface animate-fade-in-up"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <feature.icon size={24} className="text-accent" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative z-10 border-t border-border px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-8 text-sm uppercase tracking-wider text-muted-foreground">
            Trusted by developers at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            {["Vercel", "Stripe", "Linear", "Notion", "Figma"].map((company) => (
              <span key={company} className="text-lg font-medium text-muted-foreground">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
            Ready to build momentum?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Join thousands of developers who are shipping faster and learning smarter.
          </p>
          <Link to="/onboarding">
            <Button variant="hero" size="lg">
              Get Started Free
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
              <Zap size={14} className="text-accent-foreground" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">DevFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 DevFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
