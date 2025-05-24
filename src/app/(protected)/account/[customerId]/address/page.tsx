"use client";

import type React from "react";

import { useState } from "react";
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

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Định Huy",
      phone: "0962212482",
      address: "123 Đường ABC, Phường XYZ",
      ward: "Phường 1",
      district: "Quận 1",
      city: "TP. Hồ Chí Minh",
      isDefault: true,
    },
    {
      id: "2",
      name: "Định Huy",
      phone: "0962212482",
      address: "456 Đường DEF, Phường UVW",
      ward: "Phường 2",
      district: "Quận 3",
      city: "TP. Hồ Chí Minh",
      isDefault: false,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
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
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm địa chỉ mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
                </DialogTitle>
              </DialogHeader>
              <AddressForm
                address={editingAddress}
                onClose={() => setIsDialogOpen(false)}
                onSave={(address) => {
                  if (editingAddress) {
                    setAddresses(
                      addresses.map((addr) =>
                        addr.id === editingAddress.id ? address : addr
                      )
                    );
                  } else {
                    setAddresses([
                      ...addresses,
                      { ...address, id: Date.now().toString() },
                    ]);
                  }
                  setIsDialogOpen(false);
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
                      <h3 className="font-semibold">{address.name}</h3>
                      {address.isDefault && (
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
                    {!address.isDefault && (
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
                {!address.isDefault && (
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

function AddressForm({
  address,
  onClose,
  onSave,
}: {
  address: Address | null;
  onClose: () => void;
  onSave: (address: Address) => void;
}) {
  const [formData, setFormData] = useState({
    name: address?.name || "",
    phone: address?.phone || "",
    address: address?.address || "",
    ward: address?.ward || "",
    district: address?.district || "",
    city: address?.city || "",
    isDefault: address?.isDefault || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: address?.id || "",
      ...formData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Họ và tên</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
          />
        </div>
      </div>

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
            <SelectContent>
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
            <SelectContent>
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
            <SelectContent>
              <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
              <SelectItem value="hanoi">Hà Nội</SelectItem>
              <SelectItem value="danang">Đà Nẵng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
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
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {address ? "Cập nhật" : "Thêm địa chỉ"}
        </Button>
      </div>
    </form>
  );
}
