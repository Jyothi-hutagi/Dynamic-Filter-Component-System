import type { ReactNode } from 'react';
import { Button as MuiButton } from '@mui/material';
import type { ButtonProps as MuiButtonProps } from '@mui/material';

type CustomVariant = 'primary' | 'secondary' | 'danger';

interface CustomButtonProps extends Omit<MuiButtonProps, 'variant' | 'children'> {
  variant?: CustomVariant;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  children,
  ...props
}: CustomButtonProps) => {
  const getVariantAndColor = () => {
    switch (variant) {
      case 'danger':
        return { variant: 'contained' as const, color: 'error' as const };
      case 'secondary':
        return { variant: 'outlined' as const, color: 'inherit' as const };
      default:
        return { variant: 'contained' as const, color: 'primary' as const };
    }
  };

  const { variant: muiVariant, color } = getVariantAndColor();

  return (
    <MuiButton
      variant={muiVariant}
      color={color}
      {...props}
    >
      {children}
    </MuiButton>
  );
};