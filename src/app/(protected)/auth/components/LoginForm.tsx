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
      {/* Tiêu đề */}
      <div className="flex gap-4 mb-6">
        <div className="text-lg font-medium text-zinc-900 border-b-2 border-red-500 pb-2">
          Đăng nhập
        </div>
        <button
          onClick={onSwitchToSignup}
          className="text-lg text-zinc-500 hover:text-zinc-700 pb-2"
        >
          Đăng ký
        </button>
      </div>

      {/* Biểu mẫu */}
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
            placeholder="Nhập email hoặc số điện thoại"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-zinc-600">
            Mật khẩu
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 border-zinc-300 focus:border-red-500 pr-10"
              placeholder="Nhập mật khẩu"
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
          {isSubmitting ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
        </Button>

        <div className="flex justify-between text-sm">
          <button className="text-blue-600 hover:text-blue-700">
            Quên mật khẩu
          </button>
        </div>

        <div className="text-center text-sm text-zinc-500">
          Mới đến với GymMax?{" "}
          <button
            onClick={onSwitchToSignup}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
}
