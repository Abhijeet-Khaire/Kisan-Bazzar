import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible-none focus-visible-2 focus-visible-ring focus-visible-offset-2 disabled-events-none disabled-50 [&_svg]-events-none [&_svg]-4 [&_svg]-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover-primary/90 shadow-md hover-lg",
        destructive: "bg-destructive text-destructive-foreground hover-destructive/90",
        outline: "border border-input bg-background hover-accent hover-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover-secondary/80",
        ghost: "hover-accent hover-accent-foreground",
        link: "text-primary underline-offset-4 hover",
        hero: "bg-primary text-primary-foreground hover-primary/90 shadow-lg hover-xl text-base px-8 py-6 font-semibold",
        heroOutline: "border-2 border-primary bg-transparent text-primary hover-primary hover-primary-foreground shadow-md hover-lg text-base px-8 py-6 font-semibold",
        success: "bg-chart-1 text-primary-foreground hover-90 shadow-md",
        bid: "bg-chart-2 text-foreground hover-90 shadow-md font-semibold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);



const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };



