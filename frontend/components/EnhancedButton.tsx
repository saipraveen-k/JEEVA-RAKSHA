'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}

export default function EnhancedButton({ 
  loading = false, 
  children, 
  className, 
  disabled,
  ...props 
}: EnhancedButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'relative overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95',
        loading && 'opacity-80',
        className
      )}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      <span className={cn('transition-opacity duration-200', loading && 'opacity-0')}>
        {children}
      </span>
    </Button>
  );
}
