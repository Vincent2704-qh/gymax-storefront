import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const spinVariants = cva(
  "flex items-center justify-center text-muted-foreground",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        primary: "text-primary",
        destructive: "text-destructive",
        secondary: "text-secondary",
      },
      size: {
        default: "text-sm [&_svg]:h-4 [&_svg]:w-4",
        sm: "text-xs [&_svg]:h-3 [&_svg]:w-3",
        lg: "text-base [&_svg]:h-5 [&_svg]:w-5",
      },
      fullWidth: {
        true: "w-full",
        false: "w-fit",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
);

interface SprinLoadingProps extends VariantProps<typeof spinVariants> {
  className?: string;
  text?: string;
}

export const SprinLoading = ({
  variant,
  size,
  fullWidth,
  className,
  text = "Loading...",
}: SprinLoadingProps) => {
  return (
    <div className={cn(spinVariants({ variant, size, fullWidth }), className)}>
      <LoaderCircle className="mr-2 animate-spin" />
      {text}
    </div>
  );
};
