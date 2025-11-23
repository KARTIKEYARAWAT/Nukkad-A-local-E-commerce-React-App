import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: 'default' | 'rating' | 'success' | 'warning' | 'destructive';
  rating?: number; // For rating-specific color schemes (1-5)
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant = 'default', rating, ...props }, ref) => {
  
  const getProgressColor = () => {
    if (variant === 'rating' && rating) {
      // Color scheme based on rating level (1-5 stars)
      switch (rating) {
        case 5:
          return 'bg-green-500'; // Excellent - Green
        case 4:
          return 'bg-blue-500'; // Good - Blue
        case 3:
          return 'bg-yellow-500'; // Average - Yellow
        case 2:
          return 'bg-orange-500'; // Poor - Orange
        case 1:
          return 'bg-red-500'; // Very Poor - Red
        default:
          return 'bg-primary';
      }
    }
    
    // Other variants
    switch (variant) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'destructive':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  };

  const getBackgroundColor = () => {
    if (variant === 'rating' && rating) {
      switch (rating) {
        case 5:
          return 'bg-green-100'; // Light green background
        case 4:
          return 'bg-blue-100'; // Light blue background
        case 3:
          return 'bg-yellow-100'; // Light yellow background
        case 2:
          return 'bg-orange-100'; // Light orange background
        case 1:
          return 'bg-red-100'; // Light red background
        default:
          return 'bg-secondary';
      }
    }
    return 'bg-secondary';
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full",
        getBackgroundColor(),
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all duration-300 ease-in-out rounded-full",
          getProgressColor()
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})

Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
