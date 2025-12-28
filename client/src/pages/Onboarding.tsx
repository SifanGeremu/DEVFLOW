import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const skillLevels = [
  { id: "beginner", label: "Beginner", description: "Just getting started with coding" },
  { id: "intermediate", label: "Intermediate", description: "Comfortable with one or more languages" },
  { id: "advanced", label: "Advanced", description: "Building complex applications" },
];

const techOptions = [
  "JavaScript", "TypeScript", "React", "Vue", "Angular", "Node.js",
  "Python", "Go", "Rust", "Java", "C#", "Swift", "Kotlin", "Flutter",
  "Docker", "Kubernetes", "AWS", "PostgreSQL", "MongoDB", "GraphQL",
];

const goals = [
  { id: "learn", label: "Learn new skills", description: "Master new technologies and concepts" },
  { id: "build", label: "Build a real project", description: "Ship something meaningful to production" },
];

const timelines = [
  { weeks: 4, label: "4 weeks", description: "Intensive sprint" },
  { weeks: 8, label: "8 weeks", description: "Balanced pace" },
  { weeks: 12, label: "12 weeks", description: "Deep learning" },
  { weeks: 16, label: "16 weeks", description: "Comprehensive journey" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [skillLevel, setSkillLevel] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [dailyTime, setDailyTime] = useState(60);
  const [goal, setGoal] = useState("");
  const [timeline, setTimeline] = useState(8);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const canProceed = () => {
    switch (step) {
      case 1: return skillLevel !== "";
      case 2: return techStack.length > 0;
      case 3: return true;
      case 4: return goal !== "";
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleTech = (tech: string) => {
    setTechStack((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <Zap size={20} className="text-accent-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">DevFlow</span>
        </div>
        <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
      </header>

      {/* Progress Bar */}
      <div className="px-6 lg:px-12">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl animate-fade-in">
          {/* Step 1: Skill Level */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                  What's your experience level?
                </h1>
                <p className="mt-2 text-muted-foreground">
                  This helps us tailor your learning path
                </p>
              </div>
              <div className="space-y-3">
                {skillLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSkillLevel(level.id)}
                    className={`w-full card-surface-hover text-left transition-all ${
                      skillLevel === level.id
                        ? "border-accent bg-accent/5"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">{level.label}</h3>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                      </div>
                      {skillLevel === level.id && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent">
                          <Check size={14} className="text-accent-foreground" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Tech Stack */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                  What technologies interest you?
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Select all that apply
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {techOptions.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={techStack.includes(tech) ? "chip-active" : "chip"}
                  >
                    {tech}
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground">
                {techStack.length} selected
              </p>
            </div>
          )}

          {/* Step 3: Daily Time */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                  How much time can you commit daily?
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Be realistic — consistency beats intensity
                </p>
              </div>
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-5xl font-bold text-foreground">{dailyTime}</span>
                  <span className="ml-2 text-xl text-muted-foreground">minutes</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="180"
                  step="15"
                  value={dailyTime}
                  onChange={(e) => setDailyTime(parseInt(e.target.value))}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>30 min</span>
                  <span>180 min</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Goal */}
          {step === 4 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                  What's your main goal?
                </h1>
                <p className="mt-2 text-muted-foreground">
                  This shapes your roadmap experience
                </p>
              </div>
              <div className="space-y-3">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`w-full card-surface-hover text-left transition-all ${
                      goal === g.id ? "border-accent bg-accent/5" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">{g.label}</h3>
                        <p className="text-sm text-muted-foreground">{g.description}</p>
                      </div>
                      {goal === g.id && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent">
                          <Check size={14} className="text-accent-foreground" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Timeline */}
          {step === 5 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                  Choose your timeline
                </h1>
                <p className="mt-2 text-muted-foreground">
                  How long do you want to commit?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {timelines.map((t) => (
                  <button
                    key={t.weeks}
                    onClick={() => setTimeline(t.weeks)}
                    className={`card-surface-hover text-left transition-all ${
                      timeline === t.weeks ? "border-accent bg-accent/5" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">{t.label}</h3>
                        <p className="text-sm text-muted-foreground">{t.description}</p>
                      </div>
                      {timeline === t.weeks && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent">
                          <Check size={12} className="text-accent-foreground" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <footer className="flex items-center justify-between px-6 py-6 lg:px-12">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={step === 1}
          className={step === 1 ? "invisible" : ""}
        >
          <ChevronLeft size={18} />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {step === totalSteps ? "Get Started" : "Next"}
          {step < totalSteps && <ChevronRight size={18} />}
        </Button>
      </footer>
    </div>
  );
};

export default Onboarding;
