"use client";

import { useCallback, useEffect, useState } from "react";
import { Camera, Lock, Trash2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePathname } from "next/navigation";
import { CustomerDto } from "@/types/customer-type";
import { CustomerService } from "@/services/customer.service";
import { toast } from "sonner";
import InputDropzone from "@/components/input-12";
import { FileService } from "@/services/file.service";
import UpdatePasswordDialog from "./components/UpdatePasswordDialog";
import { useAuth } from "@/components/provider/auth-context";

export default function CustomerDetailsPage() {
  const { logout } = useAuth();

  const pathname = usePathname();
  const segments = pathname.split("/");
  const customerId = segments[segments.length - 2];
  const [customer, setCustomer] = useState<CustomerDto>();
  const [isOpenSelectImage, setIsOpenSelectImage] = useState(false);
  const [isOpenUpdatePassword, setIsOpenUpdatePassword] = useState(false);

  const [avatar, setAvatar] = useState(customer?.avatar);
  const [fileUpload, setFileUpload] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    firstName: customer?.firstName ?? "",
    lastName: customer?.lastName ?? "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    gender: customer?.gender,
    phone: customer?.phone ?? "",
    email: customer?.email,
    location: customer?.location,
  });

  const handleUpdateAvatar = useCallback(async () => {
    const id = Number(customerId);

    let imgUrl = avatar;
    if (fileUpload) {
      const response = await FileService.uploadFile(fileUpload);
      imgUrl = response.data;
    }

    if (id) {
      await CustomerService.updateCustomer(id, {
        avatar: imgUrl,
      });

      setAvatar(imgUrl);
      toast.success("Update profile image successfully!");
    }
  }, [customerId, fileUpload, avatar]);

  const handleUpdateCustomerInfor = useCallback(async () => {
    if (!customerId) {
      toast.error("Customer id not found");
      return;
    }

    const { birthDay, birthMonth, birthYear } = formData;

    let birthday = 0;
    if (birthDay && birthMonth && birthYear) {
      const dateString = `${birthYear}-${birthMonth.padStart(
        2,
        "0"
      )}-${birthDay.padStart(2, "0")}`;
      birthday = Math.floor(new Date(dateString).getTime() / 1000); // 👈 đổi sang seconds
    }

    await CustomerService.updateCustomer(Number(customerId), {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      birthDay: birthday,
    });

    toast.success("Cập nhật thông tin thành công!");
  }, [customerId, formData]);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await CustomerService.getCustomerDetail(
          Number(customerId)
        );
        if (response.data) {
          setCustomer(response.data);
        }
      } catch (err) {
        const errorMessage = "Failed to fetch customer info";
        toast.error(errorMessage, {
          description: (err as Error)?.message,
        });
      }
    };

    fetchCustomer();
  }, [customerId]);

  useEffect(() => {
    if (customer) {
      const birthdayDate = customer.birthDay
        ? new Date(customer.birthDay * 1000)
        : null;

      setFormData({
        firstName: customer.firstName ?? "",
        lastName: customer.lastName ?? "",
        birthDay: birthdayDate ? String(birthdayDate.getDate()) : "",
        birthMonth: birthdayDate ? String(birthdayDate.getMonth() + 1) : "",
        birthYear: birthdayDate ? String(birthdayDate.getFullYear()) : "",
        gender: customer.gender ?? "",
        phone: customer.phone ?? "",
        email: customer.email ?? "",
        location: customer.location ?? "",
      });

      setAvatar(customer.avatar ?? "");
    }
  }, [customer]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2"></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium mb-4">
                    Thông tin cá nhân
                  </h3>
                </div>
                <div className="grid grid-cols-2">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="relative">
                      <Avatar className="h-40 w-40">
                        <AvatarImage
                          src={avatar ?? customer?.avatar}
                          alt={customer?.lastName}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
                        variant="secondary"
                        onClick={() => setIsOpenSelectImage(true)}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
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
                      <SelectContent className="bg-white">
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
                      <SelectContent className="bg-white">
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
                      <SelectContent className="bg-white">
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:text-white"
                  onClick={logout}
                >
                  Đăng xuất
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="text-white"
                  onClick={handleUpdateCustomerInfor}
                >
                  Cập nhật
                </Button>
              </div>
            </div>
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:text-white"
                      onClick={() => setIsOpenUpdatePassword(true)}
                    >
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:text-white"
                    >
                      Yêu cầu
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={isOpenSelectImage}>
        <AlertDialogContent className="bg-white max-w-3xl w-full max-h-[90vh] flex flex-col">
          <div className="overflow-y-auto overflow-x-hidden px-1">
            <AlertDialogHeader>
              <AlertDialogTitle>Cập nhật ảnh đại diện</AlertDialogTitle>
              <AlertDialogDescription>
                Chọn ảnh mới để thay đổi ảnh đại diện.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mt-2">
              <InputDropzone onFileChange={(file) => setFileUpload(file)} />
            </div>
          </div>

          <AlertDialogFooter className="border-t pt-4 mt-4">
            <AlertDialogCancel
              onClick={() => setIsOpenSelectImage(false)}
              className="hover:text-white"
            >
              Hủy bỏ
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-black text-white"
              onClick={async () => {
                await handleUpdateAvatar();
                setIsOpenSelectImage(false);
              }}
            >
              Cập nhật ảnh đại diện
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UpdatePasswordDialog
        open={isOpenUpdatePassword}
        onClose={() => setIsOpenUpdatePassword(false)}
        email={formData.email}
      />
    </div>
  );
}
