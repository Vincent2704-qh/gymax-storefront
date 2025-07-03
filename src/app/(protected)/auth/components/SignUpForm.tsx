"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { useAuth } from "@/components/provider/auth-context";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export default function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!agreeTerms) {
      alert("You must agree to the terms.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    await register(
      formData.firstName,
      formData.lastName,
      formData.phone,
      formData.email,
      formData.password
    );
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={onSwitchToLogin}
          className="text-lg text-zinc-500 hover:text-zinc-700 pb-2"
        >
          Đăng nhập
        </button>
        <div className="text-lg font-medium text-zinc-900 border-b-2 border-red-500 pb-2">
          Đăng ký
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm text-zinc-600">
              Tên
            </Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="h-12 border-zinc-300 focus:border-red-500"
              placeholder="Nhập tên"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm text-zinc-600">
              Họ
            </Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="h-12 border-zinc-300 focus:border-red-500"
              placeholder="Nhập họ"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-zinc-600">
              Địa chỉ email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="h-12 border-zinc-300 focus:border-red-500"
              placeholder="Nhập email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm text-zinc-600">
              Số điện thoại
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="h-12 border-zinc-300 focus:border-red-500"
              placeholder="Nhập số điện thoại"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-zinc-600">
            Mật khẩu
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="h-12 border-zinc-300 focus:border-red-500 pr-10"
              placeholder="Nhâp mật khẩu"
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm text-zinc-600">
            Xác nhận mật khẩu
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              className="h-12 border-zinc-300 focus:border-red-500 pr-10"
              placeholder="Nhập lại mật khẩu"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            className="text-white"
            checked={agreeTerms}
            onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
          />
          <label htmlFor="terms" className="text-sm text-zinc-600">
            Tôi đồng ý với{" "}
            <button className="text-red-500 hover:text-red-600">
              Điều khoản dịch vụ
            </button>{" "}
            và{" "}
            <button className="text-red-500 hover:text-red-600">
              Chính sách bảo mật
            </button>
          </label>
        </div>

        <Button
          className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-medium"
          onClick={handleRegister}
          disabled={isSubmitting || !agreeTerms}
        >
          {isSubmitting ? "Đang đăng ký..." : "ĐĂNG KÝ"}
        </Button>

        {/* <div className="text-center text-sm text-zinc-500">OR</div> */}

        {/* Social Login */}
        {/* <div className="grid grid-cols-2 gap-3">
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
        </div> */}

        <div className="text-center text-sm text-zinc-500">
          Already have a GymMax account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
