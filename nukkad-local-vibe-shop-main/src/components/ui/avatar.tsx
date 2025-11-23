import * as React from "react";

const Avatar = React.forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
    {...props}
  />
));

const AvatarImage = React.forwardRef(
  ({ className = "", src, alt, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);

    if (hasError || !src) return null;

    return (
      <img
        ref={ref}
        className={`aspect-square h-full w-full ${className}`}
        src={src}
        alt={alt}
        onError={() => setHasError(true)}
        {...props}
      />
    );
  }
);

const AvatarFallback = React.forwardRef(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

export { Avatar, AvatarImage, AvatarFallback };
