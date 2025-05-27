"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useState } from "react";
import { CustomerService } from "@/services/customer.service";
import { toast } from "sonner";

interface UpdatePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  email: string | undefined;
}

export default function UpdatePasswordDialog({
  open,
  onClose,
  email,
}: UpdatePasswordDialogProps) {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }

    if (!email) {
      toast.error("Email không đúng định dạng");
      return;
    }

    try {
      await CustomerService.updatePassword({
        email,
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      toast.success("Cập nhật mật khẩu thành công");
      onClose();
    } catch (error) {
      toast.error("Cập nhật mật khẩu thất bại", {
        description: (error as Error).message,
      });
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-white max-w-xl w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>Thay đổi mật khẩu</AlertDialogTitle>
          <AlertDialogDescription>
            Nhập mật khẩu cũ và mật khẩu mới của bạn.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
            <Input
              id="oldPassword"
              name="oldPassword"
              type="password"
              value={form.oldPassword}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        <AlertDialogFooter className="border-t pt-4 mt-4">
          <AlertDialogCancel onClick={onClose}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            className="bg-black text-white"
            onClick={handleSubmit}
          >
            Cập nhật mật khẩu
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
