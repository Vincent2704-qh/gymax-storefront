"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { usePathname } from "next/navigation";
import { CustomerDto } from "@/types/customer-type";
import { CustomerService } from "@/services/customer.service";
import { toast } from "sonner";

export interface Address {
  id?: number;
  address?: string;
  company?: string;
  phone?: string;
  ward?: string;
  district?: string;
  city?: string;
  isDefault?: number; // 0 | 1
  customerId?: number;
}

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [customer, setCustomer] = useState<CustomerDto>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const pathname = usePathname();
  const segments = pathname.split("/");
  const customerId = Number(segments[segments.length - 2]);

  // Lấy danh sách địa chỉ
  const fetchAddresses = async () => {
    try {
      const res = await CustomerService.getAddresses(customerId);
      setAddresses(res.data);
    } catch (err) {
      toast.error("Không lấy được danh sách địa chỉ");
    }
  };

  // Lấy thông tin customer
  const fetchCustomer = async () => {
    try {
      const response = await CustomerService.getCustomerDetail(customerId);
      if (response.data) setCustomer(response.data);
    } catch (err) {
      toast.error("Không lấy được thông tin khách hàng");
    }
  };

  useEffect(() => {
    fetchCustomer();
    fetchAddresses();
    // eslint-disable-next-line
  }, [customerId]);

  // Thêm địa chỉ mới
  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  // Sửa địa chỉ
  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  // Xóa địa chỉ
  const handleDeleteAddress = async (id: number | undefined) => {
    try {
      if (!id) {
        return;
      }

      await CustomerService.deleteAddress(id);
      toast.success("Đã xóa địa chỉ");
      fetchAddresses();
      // Nếu xóa địa chỉ mặc định thì cũng nên cập nhật lại customer.defaultAddressId
      if (customer?.defaultAddressId === id) {
        await CustomerService.updateCustomer(customerId, {
          defaultAddressId: undefined,
        });
        fetchCustomer();
      }
    } catch {
      toast.error("Xóa địa chỉ thất bại");
    }
  };

  // Đặt làm mặc định
  const handleSetDefault = async (id: number | undefined) => {
    try {
      if (!id) {
        return;
      }

      await CustomerService.updateAddress(id, { isDefault: 1 });
      await CustomerService.updateCustomer(customerId, {
        defaultAddressId: id,
      });
      toast.success("Đã đặt làm địa chỉ mặc định");
      fetchAddresses();
      fetchCustomer();
    } catch {
      toast.error("Cập nhật địa chỉ mặc định thất bại");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Sổ địa chỉ</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleAddAddress}
                className="bg-black text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm địa chỉ mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white">
              <DialogHeader>
                <DialogTitle>
                  {editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
                </DialogTitle>
              </DialogHeader>
              <AddressForm
                address={editingAddress}
                onClose={() => setIsDialogOpen(false)}
                onSave={async (data, isDefault) => {
                  try {
                    if (editingAddress && editingAddress.id) {
                      await CustomerService.updateAddress(editingAddress.id, {
                        ...data,
                        isDefault: isDefault ? 1 : 0,
                      });
                      if (isDefault) {
                        await CustomerService.updateCustomer(customerId, {
                          defaultAddressId: editingAddress.id,
                        });
                      }
                      toast.success("Cập nhật địa chỉ thành công");
                    } else {
                      const res = await CustomerService.createAddress(
                        customerId,
                        {
                          ...data,
                          isDefault: isDefault ? 1 : 0,
                          customerId,
                        }
                      );
                      if (isDefault) {
                        await CustomerService.updateCustomer(customerId, {
                          defaultAddressId: res.data.id,
                        });
                      }
                      toast.success("Thêm địa chỉ thành công");
                    }
                    setIsDialogOpen(false);
                    fetchAddresses();
                    fetchCustomer();
                  } catch {
                    toast.error("Lưu địa chỉ thất bại");
                  }
                }}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {addresses.map((address) => (
              <div key={address.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">
                        {customer?.firstName} {customer?.lastName}
                      </h3>
                      {address.isDefault === 1 && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Mặc định
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-1">{address.phone}</p>
                    <p className="text-gray-800 mb-1">{address.address}</p>
                    <p className="text-gray-600">
                      {address.ward}, {address.district}, {address.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Sửa
                    </Button>
                    {address.isDefault !== 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Xóa
                      </Button>
                    )}
                  </div>
                </div>
                {address.isDefault !== 1 && (
                  <div className="mt-3 pt-3 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Đặt làm địa chỉ mặc định
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Form địa chỉ
function AddressForm({
  address,
  onClose,
  onSave,
}: {
  address: Address | null;
  onClose: () => void;
  onSave: (data: Partial<Address>, isDefault: boolean) => void;
}) {
  const [formData, setFormData] = useState({
    address: address?.address || "",
    company: address?.company || "",
    phone: address?.phone || "",
    ward: address?.ward || "",
    district: address?.district || "",
    city: address?.city || "",
    isDefault: address?.isDefault === 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      {
        address: formData.address,
        company: formData.company,
        phone: formData.phone,
        ward: formData.ward,
        district: formData.district,
        city: formData.city,
      },
      formData.isDefault
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Địa chỉ cụ thể</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          placeholder="Số nhà, tên đường..."
          required
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Phường/Xã</Label>
          <Select
            value={formData.ward}
            onValueChange={(value) => setFormData({ ...formData, ward: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn phường/xã" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="phuong-1">Phường 1</SelectItem>
              <SelectItem value="phuong-2">Phường 2</SelectItem>
              <SelectItem value="phuong-3">Phường 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Quận/Huyện</Label>
          <Select
            value={formData.district}
            onValueChange={(value) =>
              setFormData({ ...formData, district: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn quận/huyện" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="quan-1">Quận 1</SelectItem>
              <SelectItem value="quan-3">Quận 3</SelectItem>
              <SelectItem value="quan-5">Quận 5</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tỉnh/Thành phố</Label>
          <Select
            value={formData.city}
            onValueChange={(value) => setFormData({ ...formData, city: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn tỉnh/thành" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
              <SelectItem value="hanoi">Hà Nội</SelectItem>
              <SelectItem value="danang">Đà Nẵng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Số điện thoại</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company">Công ty (nếu có)</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) =>
            setFormData({ ...formData, company: e.target.value })
          }
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          className="text-white"
          checked={formData.isDefault}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isDefault: checked as boolean })
          }
        />
        <Label htmlFor="isDefault">Đặt làm địa chỉ mặc định</Label>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button type="submit" className="bg-black text-white">
          {address ? "Cập nhật" : "Thêm địa chỉ"}
        </Button>
      </div>
    </form>
  );
}
