import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React from "react";

interface Supplier {
  id: number;
  name: string;
}

interface Props {
  supplierList: Supplier[];
  selectedSuppliers: number[];
  onSupplierChange: (supplierIds: number[]) => void;
}

const SupplierFilter = ({
  supplierList,
  selectedSuppliers,
  onSupplierChange,
}: Props) => {
  const handleSupplierToggle = (supplierId: number) => {
    let newSelected = [...selectedSuppliers];

    if (supplierId === 0) {
      // "Tất cả" selected
      newSelected = newSelected.includes(0) ? [] : [0];
    } else {
      // Remove "Tất cả" if other supplier is selected
      newSelected = newSelected.filter((id) => id !== 0);

      if (newSelected.includes(supplierId)) {
        newSelected = newSelected.filter((id) => id !== supplierId);
      } else {
        newSelected.push(supplierId);
      }
    }

    onSupplierChange(newSelected);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Nhà cung cấp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {supplierList.map((supplier) => (
          <div key={supplier.id} className="flex items-center space-x-2">
            <Checkbox
              id={`supplier-${supplier.id}`}
              checked={selectedSuppliers.includes(supplier.id)}
              onCheckedChange={() => handleSupplierToggle(supplier.id)}
              className="text-white"
            />
            <Label
              htmlFor={`supplier-${supplier.id}`}
              className="text-sm font-normal cursor-pointer hover:text-blue-600 transition-colors"
            >
              {supplier.name}
            </Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SupplierFilter;
