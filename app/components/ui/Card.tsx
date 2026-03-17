import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'gradient';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

const shadowClasses = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg shadow-blue-500/10',
};

const variantClasses = {
  default: 'bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800',
  elevated: 'bg-gradient-to-br from-white to-neutral-50 dark:from-slate-900 dark:to-slate-800 border border-neutral-100 dark:border-slate-700',
  outline: 'bg-transparent border-2 border-blue-200 dark:border-blue-900',
  gradient: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white',
};

export function Card({
  variant = 'default',
  padding = 'md',
  shadow = 'md',
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`
        rounded-xl
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${shadowClasses[shadow]}
        transition-all duration-300 hover:shadow-xl
        ${className}
      `}
      {...props}
    />
  );
}

export function CardContent({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`space-y-4 ${className}`} {...props} />;
}
