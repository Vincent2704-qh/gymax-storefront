import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dumbbell, PhoneCall } from "lucide-react";
import React from "react";

const CheckoutPage = () => {
  return (
    <main>
      <header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Dumbbell className="h-8 w-8 text-red-500" />
            <span className="text-xl font-bold">Thanh toán</span>
          </div>
          <div>
            <Card>
              <CardContent>
                <div>
                  <PhoneCall />

                  <div className="flex flex-col items-center"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      <body className="grid grid-cols-2">
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Chọn hình thức giao hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="standard">
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="free" id="free" />
                  <Label htmlFor="free" className="flex flex-col">
                    <span className="font-semibold">Giao hàng tiết kiệm</span>
                    <span className="text-sm text-muted-foreground">
                      35000đ
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="flex flex-col">
                    <span className="font-semibold">Giao hàng nhanh</span>
                    <span className="text-sm text-muted-foreground">
                      45000đ
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Giao tới</CardTitle>
                <Button variant={"link"} className="text-blue-500">
                  Thay đổi
                </Button>
              </div>
            </CardHeader>
            <CardContent></CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mã khuyến mãi</CardTitle>
            </CardHeader>

            <CardContent>
              <Select>
                <SelectTrigger>
                  <SelectValue>Chọn mã</SelectValue>
                </SelectTrigger>
              </Select>

              <div className="grid grid-cols-6">
                <Input
                  className="col-span-4"
                  type="text"
                  placeholder="Nhập mã khuyến mãi"
                />
                <Button className="col-span-2">Áp dụng</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chọn hình thức thanh toán</CardTitle>
            </CardHeader>

            <CardContent>
              <RadioGroup defaultValue="standard">
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="free" id="free" />
                  <Label htmlFor="free" className="flex flex-col">
                    <span className="font-semibold">
                      Thanh toán khi nhận hàng
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="flex flex-col">
                    <span className="font-semibold">
                      Thanh toán tiền bằng paypal
                    </span>
                    <span className="text-sm text-muted-foreground">
                      45000đ
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Giỏ hàng</CardTitle>
            </CardHeader>

            <CardContent></CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2">
                <div>
                  <Label>Tổng tiền hàng</Label>
                  <Label>Phí vận chuyển</Label>
                  <Label>Tổng thanh toán</Label>
                </div>
                <div></div>
              </div>

              <Button>Đặt hàng</Button>
            </CardContent>
          </Card>
        </div>
      </body>
    </main>
  );
};

export default CheckoutPage;
