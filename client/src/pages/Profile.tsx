import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Clock, Target, Calendar, Flame, Trophy, LogOut, Save, Edit2 } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const techStack = ["React", "TypeScript", "Node.js", "PostgreSQL", "TailwindCSS"];

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Sifan Bekele");
  const [email, setEmail] = useState("sifan@example.com");
  const [dailyTime, setDailyTime] = useState(60);
  const [goal, setGoal] = useState("Build a real project");

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Profile</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </header>

        <div className="space-y-6">
          {/* Profile Card */}
          <section className="card-surface animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-accent to-emerald-400 text-3xl font-bold text-accent-foreground">
                  SB
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground border-4 border-card">
                  <Flame size={14} />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">{name}</h2>
                <p className="text-muted-foreground">{email}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                  {techStack.map((tech) => (
                    <span key={tech} className="chip-active">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Edit Button */}
              <Button
                variant={isEditing ? "default" : "outline"}
                size="sm"
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              >
                {isEditing ? (
                  <>
                    <Save size={16} />
                    Save
                  </>
                ) : (
                  <>
                    <Edit2 size={16} />
                    Edit
                  </>
                )}
              </Button>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <div className="card-surface text-center">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-accent/10 mb-3">
                <Flame size={24} className="text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-xs text-muted-foreground">Current Streak</p>
            </div>
            <div className="card-surface text-center">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-accent/10 mb-3">
                <Trophy size={24} className="text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">28</p>
              <p className="text-xs text-muted-foreground">Longest Streak</p>
            </div>
            <div className="card-surface text-center">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-accent/10 mb-3">
                <Target size={24} className="text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">18</p>
              <p className="text-xs text-muted-foreground">Tasks Done</p>
            </div>
            <div className="card-surface text-center">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-accent/10 mb-3">
                <Clock size={24} className="text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">14h</p>
              <p className="text-xs text-muted-foreground">Time Invested</p>
            </div>
          </section>

          {/* Settings */}
          <section className="card-surface animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-lg font-semibold text-foreground mb-6">Preferences</h3>
            <div className="space-y-6">
              {/* Name */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-3 sm:w-48">
                  <User size={18} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Name</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field flex-1"
                  />
                ) : (
                  <span className="text-foreground">{name}</span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-3 sm:w-48">
                  <Mail size={18} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Email</span>
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field flex-1"
                  />
                ) : (
                  <span className="text-foreground">{email}</span>
                )}
              </div>

              {/* Daily Time */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-3 sm:w-48">
                  <Clock size={18} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Daily commitment</span>
                </div>
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="number"
                      value={dailyTime}
                      onChange={(e) => setDailyTime(parseInt(e.target.value))}
                      min={30}
                      max={180}
                      className="input-field w-24"
                    />
                    <span className="text-muted-foreground">minutes</span>
                  </div>
                ) : (
                  <span className="text-foreground">{dailyTime} minutes</span>
                )}
              </div>

              {/* Goal */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-3 sm:w-48">
                  <Target size={18} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Goal</span>
                </div>
                {isEditing ? (
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="input-field flex-1"
                  >
                    <option>Learn new skills</option>
                    <option>Build a real project</option>
                  </select>
                ) : (
                  <span className="text-foreground">{goal}</span>
                )}
              </div>

              {/* Timeline */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-3 sm:w-48">
                  <Calendar size={18} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Timeline</span>
                </div>
                <span className="text-foreground">8 weeks (4 remaining)</span>
              </div>
            </div>
          </section>

          {/* Sign Out */}
          <section className="animate-fade-in" style={{ animationDelay: "0.25s" }}>
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive">
                <LogOut size={18} />
                Sign out
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
