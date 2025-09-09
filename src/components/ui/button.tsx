import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50";

    const variants = {
      primary:
        "bg-primary-500 text-white hover:bg-primary-600",
      secondary:
        "bg-gray-200 text-gray-900 hover:bg-gray-300",
      danger: "bg-red-600 text-white hover:bg-red-700",
      outline:
        "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900",
      ghost: "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
    };

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-6 py-4 text-lg",
      icon: "p-2 w-9 h-9",
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export const buttonVariants = ({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  className?: string;
} = {}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50";

  const variants = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline:
      "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900",
    ghost: "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
    icon: "p-2 w-9 h-9",
  };

  return `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
};

export default Button;
