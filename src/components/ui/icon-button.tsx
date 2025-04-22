import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/helpers"

const iconButtonVariants = cva(
  "inline-flex items-center uppercase justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        ripple: "bg-primary hover:bg-primary/70 text-primary-foreground",
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-primary/10 transition-all ease-in duration-200 hover:text-primary hover:border-primary hover:border",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 w-9",
        sm: "h-8 w-8 text-xs",
        lg: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "ripple",
      size: "default",
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "ripple", size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const handleRippleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (variant !== "ripple") return;

      const button = e.currentTarget;
      const x = e.clientX - button.getBoundingClientRect().left;
      const y = e.clientY - button.getBoundingClientRect().top;

      const ripple = document.createElement("span");
      ripple.classList.add("animate-ripple")
      ripple.style.cssText = `
        left: ${x}px; 
        top: ${y}px; 
        position: absolute; 
        transform: translate(-50%, -50%); 
        pointer-events: none; 
        border-radius: 50%; 
        background-color: rgba(255, 255, 255, 0.5); 
        width: 0; 
        height: 0;
      `;

      ripple.classList.add("ripple-effect");
      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 500);
    };

    return (
      <Comp
        className={cn(iconButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        onClick={(e) => {
          if (props.onClick) props.onClick(e);
          handleRippleClick(e);
        }}
      />
    );
  }
);

IconButton.displayName = "IconButton"

export { IconButton, iconButtonVariants }
