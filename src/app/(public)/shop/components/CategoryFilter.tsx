import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Category } from "@/types/app-type.type";
import React from "react";

interface Props {
  categoryList: Category[];
  selectedCategories: number[];
  onCategoryChange: (categoryIds: number[]) => void;
}

const CategoryFilter = ({
  categoryList,
  selectedCategories,
  onCategoryChange,
}: Props) => {
  const handleCategoryToggle = (categoryId: number) => {
    let newSelected = [...selectedCategories];

    if (categoryId === 0) {
      // "Tất cả" selected
      newSelected = newSelected.includes(0) ? [] : [0];
    } else {
      // Remove "Tất cả" if other category is selected
      newSelected = newSelected.filter((id) => id !== 0);

      if (newSelected.includes(categoryId)) {
        newSelected = newSelected.filter((id) => id !== categoryId);
      } else {
        newSelected.push(categoryId);
      }
    }

    onCategoryChange(newSelected);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Các danh mục</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {categoryList.map((category) => (
          <div key={category.id} className="flex items-center space-x-2">
            <Checkbox
              id={`category-${category.id}`}
              checked={selectedCategories.includes(category.id!)}
              onCheckedChange={() => handleCategoryToggle(category.id!)}
              className="text-white"
            />
            <Label
              htmlFor={`category-${category.id}`}
              className="text-sm font-normal cursor-pointer hover:text-blue-600 transition-colors"
            >
              {category.name}
            </Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CategoryFilter;
