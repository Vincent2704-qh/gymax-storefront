"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Facebook } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { useAuth } from "@/components/provider/auth-context";
import { useRouter, useSearchParams } from "next/navigation";

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setIsSubmitting(true);
    try {
      await login(email, password).then((rs) => {
        if (rs !== undefined) {
          router.push("/");
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex gap-4 mb-6">
        <div className="text-lg font-medium text-zinc-900 border-b-2 border-red-500 pb-2">
          Login
        </div>
        <button
          onClick={onSwitchToSignup}
          className="text-lg text-zinc-500 hover:text-zinc-700 pb-2"
        >
          Register
        </button>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-zinc-600">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 border-zinc-300 focus:border-red-500"
            placeholder="Enter email or phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-zinc-600">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 border-zinc-300 focus:border-red-500 pr-10"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-medium"
          onClick={handleLogin}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "LOGIN"}
        </Button>

        <div className="flex justify-between text-sm">
          <button className="text-blue-600 hover:text-blue-700">
            Forgot password
          </button>
          <button className="text-blue-600 hover:text-blue-700"></button>
        </div>

        <div className="text-center text-sm text-zinc-500">OR</div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-12 border-zinc-300 hover:text-white"
          >
            <FaFacebook className="h-4 w-4 mr-2 text-blue-600 " />
            Facebook
          </Button>
          <Button
            variant="outline"
            className="h-12 border-zinc-300 hover:text-white"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
        </div>

        <div className="text-center text-sm text-zinc-500">
          New to GymMax?{" "}
          <button
            onClick={onSwitchToSignup}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
