import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "src/lib/utils"

const buttonVariants = cva(
  "ui-banshee-inline-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-2 ui-banshee-whitespace-nowrap ui-banshee-rounded-md ui-banshee-text-sm ui-banshee-font-medium ui-banshee-ring-offset-background ui-banshee-transition-colors focus-visible:ui-banshee-outline-none focus-visible:ui-banshee-ring-2 focus-visible:ui-banshee-ring-ring focus-visible:ui-banshee-ring-offset-2 disabled:ui-banshee-pointer-events-none disabled:ui-banshee-opacity-50 [&_svg]:ui-banshee-pointer-events-none [&_svg]:ui-banshee-size-4 [&_svg]:ui-banshee-shrink-0",
  {
    variants: {
      variant: {
        default: "ui-banshee-bg-primary ui-banshee-text-primary-foreground hover:ui-banshee-bg-primary/90",
        destructive:
          "ui-banshee-bg-destructive ui-banshee-text-destructive-foreground hover:ui-banshee-bg-destructive/90",
        outline:
          "ui-banshee-border ui-banshee-border-input ui-banshee-bg-background hover:ui-banshee-bg-accent hover:ui-banshee-text-accent-foreground",
        secondary:
          "ui-banshee-bg-secondary ui-banshee-text-secondary-foreground hover:ui-banshee-bg-secondary/80",
        ghost: "hover:ui-banshee-bg-accent hover:ui-banshee-text-accent-foreground",
        link: "ui-banshee-text-primary ui-banshee-underline-offset-4 hover:ui-banshee-underline",
      },
      size: {
        default: "ui-banshee-h-10 ui-banshee-px-4 ui-banshee-py-2",
        sm: "ui-banshee-h-9 ui-banshee-rounded-md ui-banshee-px-3",
        lg: "ui-banshee-h-11 ui-banshee-rounded-md ui-banshee-px-8",
        icon: "ui-banshee-h-10 ui-banshee-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
