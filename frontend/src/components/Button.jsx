import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils';

export const Button = ({
    children,
    variant = 'primary',
    isLoading,
    className,
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
};
