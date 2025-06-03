import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Brand } from "@/types/app-type.type";
import React from "react";

interface Props {
  brandList: Brand[];
  selectedBrands: number[];
  onBrandChange: (brandIds: number[]) => void;
}

const BrandFilter = ({ brandList, selectedBrands, onBrandChange }: Props) => {
  const handleBrandToggle = (brandId: number) => {
    let newSelected = [...selectedBrands];

    if (brandId === 0) {
      // "Tất cả" selected
      newSelected = newSelected.includes(0) ? [] : [0];
    } else {
      // Remove "Tất cả" if other brand is selected
      newSelected = newSelected.filter((id) => id !== 0);

      if (newSelected.includes(brandId)) {
        newSelected = newSelected.filter((id) => id !== brandId);
      } else {
        newSelected.push(brandId);
      }
    }

    onBrandChange(newSelected);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Các thương hiệu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {brandList.map((brand) => (
          <div key={brand.id} className="flex items-center space-x-2">
            <Checkbox
              id={`brand-${brand.id}`}
              checked={selectedBrands.includes(brand.id!)}
              onCheckedChange={() => handleBrandToggle(brand.id!)}
              className="text-white"
            />
            <Label
              htmlFor={`brand-${brand.id}`}
              className="text-sm font-normal cursor-pointer hover:text-blue-600 transition-colors"
            >
              {brand.name}
            </Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BrandFilter;
