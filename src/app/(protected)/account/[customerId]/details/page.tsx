"use client";

import { useState } from "react";
import { Camera, Phone, Mail, Lock, Shield, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function CustomerDetailsPage() {
  const [formData, setFormData] = useState({
    firstName: "Định Huy",
    lastName: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    gender: "male",
    phone: "",
    email: "",
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2"></CardHeader>
        <CardContent>
          <Separator />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Thông tin cá nhân</h3>

                {/* Avatar Section */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src="/placeholder.svg?height=80&width=80"
                        alt="Profile"
                      />
                      <AvatarFallback>DH</AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
                      variant="secondary"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Birth Date */}
                <div className="space-y-2 mt-2">
                  <Label>Ngày sinh</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Select
                      value={formData.birthDay}
                      onValueChange={(value) =>
                        setFormData({ ...formData, birthDay: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Ngày" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={formData.birthMonth}
                      onValueChange={(value) =>
                        setFormData({ ...formData, birthMonth: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tháng" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            Tháng {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={formData.birthYear}
                      onValueChange={(value) =>
                        setFormData({ ...formData, birthYear: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Năm" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 50 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2 mt-2">
                  <Label>Giới tính</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Nam</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Nữ</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Khác</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Country */}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Bảo mật</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Lock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">Thiết lập mật khẩu</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Cập nhật
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="font-medium text-red-600">
                          Yêu cầu xóa tài khoản
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Yêu cầu
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
