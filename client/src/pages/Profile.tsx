import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userApi, ProfileUpdate, User as UserType } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { User, Save, Loader2 } from "lucide-react";

export default function Profile() {
  const { token, refreshUser } = useAuth();
  const { toast } = useToast();

  const [user, setUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    skillLevel: "beginner" | "intermediate" | "advanced";
    goal: string;
    dailyTime: number;
  }>({
    name: "",
    skillLevel: "beginner",
    goal: "",
    dailyTime: 30,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile from backend
  const fetchProfile = async () => {
    if (!accessToken) return;

    try {
      setIsLoading(true);
      const res = await userApi.getProfile();
      setUser(res.data);

      setFormData({
        name: res.data.name || "",
        skillLevel: res.data.skillLevel || "beginner",
        goal: res.data.goal || "",
        dailyTime: res.data.dailyTime || 30,
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      toast({
        title: "Error",
        description: "Could not load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await userApi.updateProfile(formData as ProfileUpdate);
      await fetchProfile(); // refresh after update
      await refreshUser(); // refresh context
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update failed",
        description:
          "There was an error saving your changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container max-w-2xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">
            Customize your learning preferences and goals
          </p>
        </div>

        <Card className="animate-fade-up">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your profile details and learning preferences
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="opacity-60"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed as it's linked to your Google account
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillLevel">Skill Level</Label>
                <Select
                  value={formData.skillLevel}
                  onValueChange={(
                    value: "beginner" | "intermediate" | "advanced"
                  ) => setFormData((prev) => ({ ...prev, skillLevel: value }))}
                >
                  <SelectTrigger id="skillLevel">
                    <SelectValue placeholder="Select your skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  This helps us tailor your learning roadmap
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Learning Goal</Label>
                <Input
                  id="goal"
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, goal: e.target.value }))
                  }
                  placeholder="e.g., Full Stack Development, Mobile Apps"
                />
                <p className="text-xs text-muted-foreground">
                  What do you want to achieve?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dailyTime">Daily Learning Time (minutes)</Label>
                <Input
                  id="dailyTime"
                  type="number"
                  min={15}
                  max={240}
                  value={formData.dailyTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dailyTime: Number(e.target.value) || 30,
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  How much time can you dedicate daily? (15-240 minutes)
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" variant="default" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card
          className="mt-6 animate-fade-up"
          style={{ animationDelay: "100ms" }}
        >
          <CardHeader>
            <CardTitle className="text-lg">Your Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-secondary/50 text-center">
                <p className="text-3xl font-bold text-gradient">
                  {user.currentStreak}
                </p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 text-center">
                <p className="text-3xl font-bold text-accent">
                  {user.longestStreak}
                </p>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
