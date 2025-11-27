
import { Loader2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './animate-ui/components/animate/tooltip';
import { Button, type ButtonProps } from './animate-ui/components/buttons/button';

interface ButtonWrapperProps extends Omit<ButtonProps, 'onClick'> {
  children: ReactNode;
  tooltip: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<unknown> | void;
}

export function ButtonWrapper({ children, tooltip, onClick, variant = 'default', disabled, asChild, ...props }: ButtonWrapperProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onClick) return;

    try {
      const result = onClick(e);
      if (result instanceof Promise) {
        setIsLoading(true);
        await result;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger >
        <Button
          variant={variant}
          onClick={handleClick}
          disabled={disabled || isLoading}
          {...props}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
