import * as React from "react";

const DropdownMenu = ({ children, open, onOpenChange, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Use controlled open state if provided, otherwise use internal state
  const dropdownOpen = open !== undefined ? open : isOpen;
  const setDropdownOpen = onOpenChange || setIsOpen;

  return (
    <div className="relative inline-block text-left" {...props}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          isOpen: dropdownOpen,
          setIsOpen: setDropdownOpen,
        })
      )}
    </div>
  );
};

const DropdownMenuTrigger = React.forwardRef(
  ({ children, isOpen, setIsOpen, asChild, ...props }, ref) => {
    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(!isOpen);
    };

    if (asChild) {
      return React.cloneElement(children, {
        ...props,
        ref,
        onClick: handleClick,
      });
    }

    return (
      <button ref={ref} onClick={handleClick} {...props}>
        {children}
      </button>
    );
  }
);

const DropdownMenuContent = React.forwardRef(
  (
    { children, className = "", align = "center", isOpen, setIsOpen, ...props },
    ref
  ) => {
    const contentRef = React.useRef();

    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (contentRef.current && !contentRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, setIsOpen]);

    if (!isOpen) return null;

    const alignmentClasses = {
      start: "left-0",
      center: "left-1/2 transform -translate-x-1/2",
      end: "right-0",
    };

    return (
      <div
        ref={contentRef}
        className={`absolute top-full mt-2 ${alignmentClasses[align]} bg-white rounded-md border shadow-lg z-50 ${className}`}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const DropdownMenuItem = React.forwardRef(
  (
    { children, onClick, className = "", asChild, closeOnClick = true, ...props },
    ref
  ) => {
    const handleClick = (e) => {
      e.stopPropagation();
      if (onClick) onClick(e);
      // Don't auto-close unless explicitly requested
    };

    if (asChild) {
      return React.cloneElement(children, {
        ...props,
        ref,
        className: `block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${className}`,
        onClick: handleClick,
      });
    }

    return (
      <div
        ref={ref}
        className={`block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${className}`}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const DropdownMenuSeparator = ({ className = "", ...props }) => (
  <div className={`border-t border-gray-200 my-1 ${className}`} {...props} />
);

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};
