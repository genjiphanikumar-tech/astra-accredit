import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === "forgot") {
        const { error } = await resetPassword(email);
        if (error) throw error;
        toast({ title: "Check your email", description: "We sent a password reset link." });
        setMode("login");
      } else if (mode === "signup") {
        const { error } = await signUp(email, password, displayName);
        if (error) throw error;
        toast({ title: "Account created", description: "Please check your email to verify your account before signing in." });
        setMode("login");
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-glow w-full max-w-md p-8"
      >
        <h1 className="font-heading text-2xl font-bold text-gradient-cyan mb-1">Auto Scale AI</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {mode === "login" && "Sign in to your account"}
          {mode === "signup" && "Create a new account"}
          {mode === "forgot" && "Reset your password"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" className="pl-10" required />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" className="pl-10" required />
            </div>
          </div>

          {mode !== "forgot" && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10" required minLength={6} />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Please wait…" : (
              <>
                {mode === "login" && "Sign In"}
                {mode === "signup" && "Create Account"}
                {mode === "forgot" && "Send Reset Link"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground space-y-1">
          {mode === "login" && (
            <>
              <button onClick={() => setMode("forgot")} className="hover:text-primary transition-colors block mx-auto">Forgot password?</button>
              <p>No account?{" "}<button onClick={() => setMode("signup")} className="text-primary hover:underline">Sign up</button></p>
            </>
          )}
          {mode === "signup" && (
            <p>Already have an account?{" "}<button onClick={() => setMode("login")} className="text-primary hover:underline">Sign in</button></p>
          )}
          {mode === "forgot" && (
            <button onClick={() => setMode("login")} className="text-primary hover:underline">Back to sign in</button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
